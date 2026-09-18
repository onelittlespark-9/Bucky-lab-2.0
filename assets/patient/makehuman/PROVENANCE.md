# Bucky Lab articulated patient source

These files are the MakeHuman HM08 base mesh, default skeleton and default skin weights from
`makehumancommunity/makehuman` commit `a8bc2d54ff0ac92e78ff71431b1023eda42bf482`.

- Upstream: https://github.com/makehumancommunity/makehuman
- Mesh: `makehuman/data/3dobjs/base.obj`
- Skeleton: `makehuman/data/rigs/default.mhskel`
- Weights: `makehuman/data/rigs/default_weights.mhw`
- Asset licence: CC0 1.0 Universal (`LICENSE.CC0.md`)

The three source files are stored with lossless gzip compression. The source mesh is anatomically proportioned and the supplied skeleton/weights provide actual
deformation data. Bucky Lab must convert and validate this source before presenting it in the
radiography workspace. The legacy external `human.glb` is not derived from these files and is not
an acceptable final positioning model.
