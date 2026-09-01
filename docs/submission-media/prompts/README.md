# Image-generation policy and prompt status

No current gallery asset requires a ChatGPT Image generation pass.

Assets 01, 02, 03, and 06 are exact-copy diagrams that are more reliable and more
editable as deterministic SVG compositions. The installed image-generation skill
explicitly routes simple diagrams, vector graphics, and established brand systems
to SVG/HTML/canvas rather than raster generation, so an image model was not used.

Assets 04 and 05 must be factual product screenshots. An image model must not
generate, complete, restyle, or repair their UI. Their production input is a clean
real capture plus deterministic annotations.

If a later human requests a non-UI visual exploration, use this paste-ready prompt
only for a background/motif study, then place all required copy in the SVG source:

```text
Use case: infographic-diagram
Asset type: 3:2 judge-facing background/motif study for a WebMCP research product
Exact aspect ratio: 3:2 landscape
Primary request: Create a restrained editorial background system built from three
connected nodes representing Human, Agent, and Website. Use large quiet off-white
surfaces, dark near-black text-safe areas, muted green, restrained gold/tan, and a
small amount of muted agent blue. Leave generous negative space for deterministic
typography and diagrams to be added later.
Layout hierarchy: one subtle three-node loop motif; broad empty headline zone;
quiet supporting-detail zone; no interface panels.
Required copy: NONE — do not render any words or letterforms.
Brand/style direction: professional, technically credible, modern, restrained,
editorial, clear at thumbnail size, flat/vector-friendly geometry.
Things to avoid: product UI, screenshots, browser chrome, fake controls, glowing AI
brains, humanoid robots, stock-photo imagery, cyberpunk effects, dense gradients,
neon, tiny decorative text, logos, watermarks.
Text rule: do not add or alter text; the asset intentionally contains no text.
UI rule: do not invent or imply any product interface.
```

This optional study is not a missing dependency and is not required to finish any
of the current assets.
