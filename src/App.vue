<template>
  <div>
    <div><input v-model.number="depth" /></div>
    <div id="stage" />
  </div>
</template>

<script lang="ts">
import * as Two from "two.js";

import { defineComponent } from "vue";
import { IFS, SquareDatum, TreeNode } from "./lib/ifs";

export default defineComponent({
  data: function () {
    return {
      root: new TreeNode(new SquareDatum(0, 0, window.innerHeight), "root"),

      two: new Two.default({
        type: Two.default.Types.canvas,
        width: window.innerHeight,
        height: window.innerHeight,
      }),

      clicked: undefined as TreeNode<SquareDatum> | undefined,
      depth: 3,
    };
  },

  methods: {
    generate(
      root: TreeNode<SquareDatum>,
      fractalFunction: (
        t: TreeNode<SquareDatum>
      ) => Array<TreeNode<SquareDatum>>,
      depth: number
    ): Array<TreeNode<SquareDatum>> {
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
    },
  },

  watch: {
    leaves(newLeaves: Array<TreeNode<SquareDatum>>): void {
      this.two.clear();

      newLeaves.forEach((v) => {
        const square = this.two.makeRectangle(
          v.data.x,
          v.data.y,
          v.data.w,
          v.data.w
        );
        square.fill = "#FFF000";
      });

      this.two.update();
    },
  },

  computed: {
    highlights(): Array<TreeNode<SquareDatum>> {
      const ret: Array<TreeNode<SquareDatum>> = [];

      let next: TreeNode<SquareDatum> | undefined = this.clicked;

      while (next != undefined) {
        ret.push(next);

        next = next.parent;
      }

      return ret;
    },
    leaves: function (): Array<TreeNode<SquareDatum>> {
      const val = IFS.generate(
        this.root,
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
                new TreeNode(
                  new SquareDatum(x, y, w),
                  `${t.key}/(${i},${j})`,
                  t
                )
              );
            }
          }

          return ret;
        },
        this.depth
      );

      return val;
    },
  },

  mounted: function (): void {
    const canvas = document.getElementById("stage") as Element;
    this.two.appendTo(canvas);

    // this.two.appendTo(document.body);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  background-color: white;
}
</style>
