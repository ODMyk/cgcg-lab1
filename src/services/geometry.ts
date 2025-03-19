import {Triangle} from 'types/Triangle';

export function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export function grahamScan(points: Point[]): Point[] {
  if (points.length < 3) return points;

  // Sort points by x, then by y
  points.sort((a, b) => a.x - b.x || a.y - b.y);

  const hull: Point[] = [];

  // Lower hull
  for (const p of points) {
    while (
      hull.length >= 2 &&
      crossProduct(hull[hull.length - 2], hull[hull.length - 1], p) <= 0
    ) {
      hull.pop();
    }
    hull.push(p);
  }

  // Upper hull
  const lowerSize = hull.length;
  for (let i = points.length - 2; i >= 0; i--) {
    const p = points[i];
    while (
      hull.length > lowerSize &&
      crossProduct(hull[hull.length - 2], hull[hull.length - 1], p) <= 0
    ) {
      hull.pop();
    }
    hull.push(p);
  }

  hull.pop(); // Remove last duplicate point

  return hull;
}

export function triangleArea(a: Point, b: Point, c: Point): number {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
}

export function findMaximalTriangles(convexHull: Point[]): Triangle[] {
  const n = convexHull.length;
  const maxima: Triangle[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let left = i + 1,
        right = j - 1,
        best = left;
      let maxArea = triangleArea(
        convexHull[i],
        convexHull[j],
        convexHull[best],
      );

      for (let k = left + 1; k <= right; k++) {
        const area = triangleArea(convexHull[i], convexHull[j], convexHull[k]);
        if (area > maxArea) {
          maxArea = area;
          best = k;
        }
      }

      maxima.push({p1: convexHull[i], p2: convexHull[j], p3: convexHull[best]});
    }
  }

  return maxima;
}

export function findLargestTriangle(convexHull: Point[]): Triangle {
  const maxima = findMaximalTriangles(convexHull);
  let maxTriangle = maxima[0];
  let maxArea = triangleArea(maxTriangle.p1, maxTriangle.p2, maxTriangle.p3);

  for (const triangle of maxima) {
    const area = triangleArea(triangle.p1, triangle.p2, triangle.p3);
    if (area > maxArea) {
      maxTriangle = triangle;
      maxArea = area;
    }
  }

  return maxTriangle;
}
