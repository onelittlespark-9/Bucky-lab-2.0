# Medically reviewed real radiographs

This is a curated first replacement for the previous low-fidelity positioning SVGs.

The 11 JPG files are obtained from Wikimedia Commons works authored by Mikael Häggström, MD under the Creative Commons CC0 1.0 dedication. File titles, source links, and examination notes are captured in `src/core/real-radiograph-manifest.json`. The import script computes Wikimedia's canonical path from the image filename (MD5) and checks JPEG magic and plausible length. Build and Playwright browser tests fail if any required radiograph fails to load. A GitHub workflow attempts to persist the downloaded binary files in this repository.

A **real radiograph demonstrates projected anatomy**. It does not show the patient's original positioning photograph, and is not a reproduction of Clark's positioning diagrams. The imaging examples are unmodified; the on-page elbow landmark markers are illustrative and can be hidden. Initial elbow markers require faculty review before clinical grading.

For the 27 projections not yet matched to a reviewed genuine image, older diagrams remain explicitly marked as **unverified schematics**. This batch does not claim full replacement.

Sources: https://commons.wikimedia.org/wiki/File:X-ray_of_normal_elbow_by_anteroposterior_projection.jpg and each corresponding Commons source link in the manifest.

The 13 AI-generated infographic PNGs from prior discussion are not in this commit. They may contain anatomical/positioning inaccuracies and are distinct from the sourced real radiographs.
