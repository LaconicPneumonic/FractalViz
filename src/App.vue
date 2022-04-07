<template>
  <div class="canvas">
    <div v-for="l in this.leaves" :key="l.key" :style="datumStyle(l.data)">
      <!-- {{ datumStyle(l.data) }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IFS, SquareDatum, TreeNode } from "./lib/ifs";

export default defineComponent({
  data: function () {
    return {
      root: new TreeNode(new SquareDatum(0, 0, window.innerHeight), "root"),

      depth: 3,
    };
  },

  methods: {
    datumStyle(datum: SquareDatum): {
      border: string;
      position: string;
      width: string;
      height: string;
      left: string;
      top: string;
      background: string;
    } {
      const ret = {
        border: "solid",
        position: "absolute",
        width: datum.w + "px",
        height: datum.w + "px",
        left: datum.x + "px",
        top: datum.y + "px",
        background: "#000000",
        // "border-color": "#FFFFFF",
      };

      return ret;
    },

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

  computed: {
    leaves: function (): Array<TreeNode<SquareDatum>> {
      return IFS.generate(
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
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

body {
  background-color: white;
}
</style>
