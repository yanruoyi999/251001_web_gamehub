# Country Shape Quiz assets

The 24 local PNGs under `public/images/country-shapes` were derived from Natural Earth's [1:110m Admin 0 countries](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/), [version 5.1.2 GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/v5.1.2/geojson/ne_110m_admin_0_countries.geojson). The original GeoJSON SHA-256 is `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f`.

Natural Earth puts its vector map data in the [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Each PNG selects one `ADM0_A3` feature, centers it with its aspect ratio preserved after applying longitude scaling at the feature's average latitude, and renders its rings with an even-odd fill. These are simplified silhouettes at separate scales for play. Game logic, presentation, and clues are original to Luma.
