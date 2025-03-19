/* eslint-disable @typescript-eslint/no-explicit-any */
import lodashReduce from 'lodash/reduce';

export const ACTION_DIVIDER = ' -> ';

type FullActionType<MajorType extends string, Key> = Key extends string
  ? `${MajorType}${typeof ACTION_DIVIDER}${Key}`
  : string;

interface Options {
  isMultiInstanceProcess?: boolean;
}

export interface FailContext {
  errorMessage: string;
}

type FailAction<T extends FailContext> = (context: T) => T;

interface Failable<T extends FailContext = FailContext> {
  FAILED: FailAction<T>;
}

interface MaybeFailable<T extends FailContext = FailContext> {
  FAILED?: FailAction<T>;
}

interface PayloadFunc {
  (...params: any[]): any;
}
interface StructureType {
  [propName: string]: PayloadFunc | boolean;
}
type InputStructureType<T extends FailContext> = StructureType &
  MaybeFailable<T>;

export type ActionFactories<
  F extends FailContext,
  MajorType extends string,
  T extends InputStructureType<F>,
> = {
  [K in keyof T]: Readonly<{
    id?: string | number;
    type: FullActionType<MajorType, K>;
    create: (
      ...params: T[K] extends (...args: infer U) => any ? U : []
    ) => ActionObject<FullActionType<MajorType, K>, T, K>;
  }>;
} & {
  majorType: MajorType;
  id?: string | number;
};

type ActionObject<
  ActionPartType,
  T extends StructureType,
  K extends keyof T,
> = {
  id?: string | number;
  type: ActionPartType;
  payload: T[K] extends (...args: any[]) => infer U ? U : undefined;
};

type ResetFunction = () => undefined;

interface Resetable {
  RESET: ResetFunction;
}

type ActionExtensions<T extends FailContext = FailContext> = Resetable &
  Failable<T>;

type CreateActionReturnType<
  MajorType extends string,
  T extends StructureType,
  F extends FailContext,
  O,
> = O extends {
  isMultiInstanceProcess: true;
}
  ? {
      (
        ...actionIdParts: Array<string | number | null | undefined>
      ): ActionFactories<F, MajorType, T & ActionExtensions<F>>;
    }
  : ActionFactories<F, MajorType, T & ActionExtensions<F>>;

/**
 *
 * @param {string} majorType
 * @param {T} structure
 * @param {Options} options
 */
export function createAction<
  F extends FailContext = FailContext,
  MajorType extends string = string,
  T extends InputStructureType<F> = InputStructureType<F>,
  K extends keyof T = keyof T,
  O extends Options = Options,
>(
  majorType: MajorType,
  structure: T,
  options?: O,
): CreateActionReturnType<MajorType, T, F, O> {
  const extendedStructure: T & ActionExtensions<F> = {
    ...structure,
    FAILED: structure.FAILED ?? ((context: FailContext) => context),
    RESET: () => undefined,
  };
  const actionGenerator = function (
    ...actionIdParts: Array<string | number>
  ): Readonly<ActionFactories<F, MajorType, T>> {
    // @ts-expect-error // need to fix the problem with computed fields somehow
    const actionObject: Partial<ActionFactories<MajorType, T>> = {
      majorType,
      id:
        actionIdParts.length === 0
          ? undefined
          : actionIdParts.length === 1
            ? actionIdParts[0]
            : lodashReduce(
                actionIdParts,
                (result: string, n: string | number): string =>
                  `${result}${result ? ACTION_DIVIDER : ''}${n}`,
                '',
              ),
    };

    Object.keys(extendedStructure).forEach(
      (structureKey: keyof typeof structure) => {
        const actionPartType = `${majorType}${ACTION_DIVIDER}${String(
          structureKey,
        )}` as const;

        let createFunction = (): ActionObject<typeof actionPartType, T, K> => ({
          id: actionObject.id,
          type: actionPartType,
          payload: undefined as T[K] extends (...args: any[]) => infer U
            ? U
            : undefined,
        });

        const actionPartKey = structureKey as K;
        if (extendedStructure[actionPartKey]) {
          if (extendedStructure[actionPartKey] instanceof Function) {
            // Use function provided by consumer

            createFunction = (
              ...params
            ): ActionObject<typeof actionPartType, T, K> => ({
              id: actionObject.id,
              type: actionPartType,
              payload: (extendedStructure[actionPartKey] as PayloadFunc)(
                ...params,
              ),
            });
          }
        }

        actionObject[actionPartKey] = {
          id: actionObject.id,
          type: actionPartType,
          create: createFunction,
        } as ActionFactories<F, MajorType, T>[K];
      },
    );

    return Object.freeze(actionObject as ActionFactories<F, MajorType, T>);
  };

  if (options?.isMultiInstanceProcess) {
    return actionGenerator as CreateActionReturnType<MajorType, T, F, O>;
  } else {
    return actionGenerator() as CreateActionReturnType<MajorType, T, F, O>;
  }
}
