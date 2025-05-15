import {LinkedListNode} from 'types/LinkedListNode';
import {Triangle} from 'types/Triangle';

/**
 * Calculates the cross product of the vectors AB and AC.
 *
 * @param a - The starting point of the vectors.
 * @param b - The endpoint of the vector AB.
 * @param c - The endpoint of the vector AC.
 * @returns The cross product of the vectors AB and AC. A positive
 * value indicates a counter-clockwise turn, negative indicates
 * a clockwise turn, and zero indicates collinearity.
 */
export function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Finds the starting point and the centroid of the given points.
 *
 * The starting point is the point with the lowest y-coordinate. If there
 * are multiple such points, the one with the lowest x-coordinate is chosen.
 *
 * The centroid is the average of first three non-collinear points.
 *
 * @param points - The points to find the starting point and centroid for.
 * @returns An object containing the starting point and the centroid.
 * @throws An error if the convex hull is not defined (All points are collinear).
 */
function getStartingData(points: Point[]): {
  centroid: Point;
  startingPoint: Point;
} {
  const p1 = points[0];
  const p2 = points[1];
  let lowest = p1.y < p2.y ? p1 : p1.y === p2.y && p1.x > p2.x ? p2 : p1;
  let centroid: Point | null = null;
  for (let i = 2; i < points.length; i++) {
    const p3 = points[i];
    if (p3.y < lowest.y || (p3.y === lowest.y && p3.x < lowest.x)) {
      lowest = p3;
    }

    if (centroid === null && crossProduct(p1, p2, p3) !== 0) {
      centroid = {x: (p1.x + p2.x + p3.x) / 3, y: (p1.y + p2.y + p3.y) / 3};
    }
  }

  if (centroid === null) {
    throw new Error('Convex hull is not defined');
  }

  return {
    centroid,
    startingPoint: lowest,
  };
}

/**
 * Calculates the angle between the vector from the centroid to the starting
 * point and the vector from the centroid to the given point.
 *
 * The angle is measured in radians and is between 0 and 2 * PI.
 *
 * @param centroid - The centroid of the points.
 * @param starting - The starting point.
 * @param p - The point for which the angle should be calculated.
 * @returns The angle in radians.
 */
function angleFromStarting(centroid: Point, starting: Point, p: Point): number {
  const baseAngle = Math.atan2(
    starting.y - centroid.y,
    starting.x - centroid.x,
  );
  const pointAngle = Math.atan2(p.y - centroid.y, p.x - centroid.x);
  let angle = pointAngle - baseAngle;
  if (angle < 0) angle += 2 * Math.PI;
  return angle;
}

/**
 * Calculates the square of the Euclidean distance between two points.
 *
 * @param p1 - The first point.
 * @param p2 - The second point.
 * @returns The square of the Euclidean distance.
 */
function distanceSquared(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

/**
 * Converts an array of points into a circular doubly linked list.
 *
 * @param points - The array of points to be converted.
 * @returns The head of the circular doubly linked list containing the points.
 * The list is circular, meaning the last node's next points to the head, and
 * the head's prev points to the last node.
 */

function toLinkedList(points: Point[]): LinkedListNode<Point> {
  const head = {data: points[0]} as LinkedListNode<Point>;
  let current = head;

  for (let i = 1; i < points.length; i++) {
    current.next = {
      data: points[i],
      next: null,
      prev: current,
    } as LinkedListNode<Point>;
    current = current.next;
  }

  head.prev = current;
  current.next = head;

  return head;
}

/**
 * Computes the convex hull of a given set of points using the Graham scan algorithm.
 *
 * The algorithm works by first finding the centroid and the starting point of the
 * convex hull. The starting point is the point with the lowest y-coordinate. If
 * there are multiple such points, the one with the lowest x-coordinate is chosen.
 *
 * Then, the points are sorted by their angle relative to the centroid and
 * starting point. If two points have the same angle, the one closer to the
 * centroid is put first.
 *
 * Finally, the points are traversed in order, and if a point is not part of the
 * convex hull (i.e., the cross product of the vectors from the current point to
 * the next point and from the current point to the point after the next point is
 * not positive), it is skipped.
 *
 * @param points - The points to compute the convex hull for.
 * @returns The points of the convex hull in counterclockwise order.
 */
export function grahamScan(points: Point[]): Point[] {
  if (points.length < 3) return points;

  const {centroid, startingPoint} = getStartingData(points);

  const sorted = points.sort((a, b) => {
    const angleA = angleFromStarting(centroid, startingPoint, a);
    const angleB = angleFromStarting(centroid, startingPoint, b);

    if (angleA === angleB) {
      return distanceSquared(centroid, a) - distanceSquared(centroid, b);
    }

    return angleA - angleB;
  });

  const head = toLinkedList(sorted);
  let current = head;

  while (current.next !== head) {
    if (
      crossProduct(
        current.data,
        current.next!.data,
        current.next!.next!.data,
      ) <= 0
    ) {
      current.next = current.next!.next;
      current.next!.prev = current;
      current = current === head ? current : current.prev!;
    } else {
      current = current.next!;
    }
  }

  const hull = [];

  current = head;
  do {
    hull.push(current.data);
    current = current.next!;
  } while (current !== head);

  return hull;
}

/**
 * Calculates the area of the triangle formed by the three points a, b, c.
 * @param a - The first point.
 * @param b - The second point.
 * @param c - The third point.
 * @returns The area of the triangle.
 */
export function triangleArea(a: Point, b: Point, c: Point): number {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
}

/**
 * Finds the triangle with the largest area within the given convex hull.
 * @param convexHull - The convex hull points.
 * @returns The triangle with the largest area.
 */
export function findLargestTriangle(convexHull: Point[]): Triangle {
  const n = convexHull.length;
  if (n < 3) throw new Error('Need at least 3 points');

  let maxArea = 0;
  let bestTriangle: Triangle = {
    p1: convexHull[0],
    p2: convexHull[1],
    p3: convexHull[2],
  };

  // Проходимо всі вершини як фіксовану точку A
  for (let a = 0; a < n; a++) {
    let b = (a + 1) % n;
    let c = (a + 2) % n;

    let updated = true;
    while (updated) {
      updated = false;

      // Пробуємо зсунути c вперед
      let nextC = (c + 1) % n;
      const areaC = triangleArea(convexHull[a], convexHull[b], convexHull[c]);
      const areaNextC = triangleArea(
        convexHull[a],
        convexHull[b],
        convexHull[nextC],
      );
      if (areaNextC > areaC) {
        c = nextC;
        updated = true;
        continue;
      }

      // Пробуємо зсунути b вперед
      let nextB = (b + 1) % n;
      const areaB = triangleArea(convexHull[a], convexHull[b], convexHull[c]);
      const areaNextB = triangleArea(
        convexHull[a],
        convexHull[nextB],
        convexHull[c],
      );
      if (areaNextB > areaB) {
        b = nextB;
        updated = true;
      }
    }

    const finalArea = triangleArea(convexHull[a], convexHull[b], convexHull[c]);
    if (finalArea > maxArea) {
      maxArea = finalArea;
      bestTriangle = {
        p1: convexHull[a],
        p2: convexHull[b],
        p3: convexHull[c],
      };
    }
  }

  return bestTriangle;
}
