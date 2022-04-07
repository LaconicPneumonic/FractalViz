/**
 * 1. develop tree system
 * 2. create ifs system to operate on tree nodes
 * 3. create equation set for sierpenski's carpet
 * 4. figure out rendering system. SVG/Div/canvas/webgl
 */

export class SquareDatum {
  x: number;
  y: number;
  w: number;

  /**
   *
   */
  constructor(x: number, y: number, w: number) {
    this.x = x;
    this.y = y;
    this.w = w;
  }
}

export class TreeNode<T> {
  public data: T;

  public children: Array<TreeNode<T>> = [];
  public parent: TreeNode<T> | undefined;

  public key: number | string;

  constructor(data: T, key: number | string, parent?: TreeNode<T>) {
    this.data = data;
    this.key = key;
    this.parent = parent;
  }

  print(indent = 0): void {
    console.log(" ".repeat(indent) + JSON.stringify(this.data, null, 2));
    this.children.forEach((c) => c.print(indent + 1));
  }
}

export class IFS {
  /**
   * returns array of leaves and modifies root
   */

  static generate<T>(
    root: TreeNode<T>,
    fractalFunction: (t: TreeNode<T>) => Array<TreeNode<T>>,
    depth: number
  ): Array<TreeNode<T>> {
    let unseen = [root];
    while (depth != 0 && unseen.length != 0) {
      unseen = unseen.flatMap((n) => {
        const children = fractalFunction(n);

        n.children = children;

        return children;
      });
      depth--;
    }
    return unseen;
  }
}

// function main() {
//   // main code

//   const root = new TreeNode(new SquareDatum(0, 0, 2), "root");

//   IFS.generate(
//     root,
//     (t) => {
//       const scale = 1 / 3;

//       const translateIncrement = 1 / 3;

//       const ret = [];
//       for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//           const x = t.data.x + t.data.w * translateIncrement * i;
//           const y = t.data.y + t.data.w * translateIncrement * j;
//           const w = t.data.w * translateIncrement;

//           if (i == 0 && j == 1) continue;

//           ret.push(
//             new TreeNode(new SquareDatum(x, y, w), `${t.key}/(${i},${j})`, t)
//           );
//         }
//       }

//       return ret;
//     },
//     3
//   ).print();
// }

// if (!module.parent) {
//   // this is the main module

//   main();
// }
