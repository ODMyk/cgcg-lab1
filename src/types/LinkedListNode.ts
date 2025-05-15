export interface LinkedListNode<T> {
  data: T;
  next: LinkedListNode<T> | null;
  prev: LinkedListNode<T> | null;
}
