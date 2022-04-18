import { IFS, SquareDatum, TreeNode } from "@/lib/ifs";

describe("IFS", () => {
  it("creates a binary tree", () => {
    const root = new TreeNode("root", "root");

    IFS.generate(
      root,
      (t) => [
        new TreeNode(t.data + "/l", t.data + "/l"),
        new TreeNode(t.data + "/r", t.data + "/r"),
      ],
      2
    );

    expect(root.children.map((t) => t.data)).toEqual(["root/l", "root/r"]);
  });

  it("creates a large 8-ary tree", () => {
    const root = new TreeNode(
      new SquareDatum(0, 0, window.innerHeight),
      "root"
    );

    const depth = 5;

    const children = IFS.generate(
      root,
      (t) => {
        const translateIncrement = 1 / 3;

        const ret = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (i == 1 && j == 1) continue;

            const x = t.data.x + t.data.w * translateIncrement * i;
            const y = t.data.y + t.data.w * translateIncrement * j;
            const w = t.data.w * translateIncrement;

            ret.push(
              new TreeNode(new SquareDatum(x, y, w), `${t.key}/(${i},${j})`, t)
            );
          }
        }

        return ret;
      },
      depth
    );

    expect(children).toHaveLength(8 ** depth);
  });
});
