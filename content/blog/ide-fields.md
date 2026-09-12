---
title: "The field around an interdigitated sensor"
description: "An electrostatic model of the electrode geometry used in my capacitive-sensor research."
date: "2026-01-16"
date_display: "January 16, 2026"
tags: ["PhD research", "Capacitive sensing", "Simulation", "Python"]
published: true
---

In my ice-sensor work, the copper electrodes lie alongside one another on the surface of a board, with the fingers of one electrode extending into the spaces between the fingers of the other. This interdigitated arrangement allows the electric field to reach into the material above the board, where water or ice can change the capacitance. Part of the field also passes through the substrate beneath the copper, however, so the measurement depends on more than the sample resting on the surface. The geometry of the electrodes and the materials around them together determine what the sensor responds to.

I wanted to examine this distribution before treating the capacitance as a single number. In particular, the distance over which the field extends above the board affects how much of a sample contributes to the measurement. Increasing the sample thickness will eventually make little difference, while a coating close to the electrodes may occupy a substantial part of the region being sensed. A two-dimensional section through the fingers provides a way to study this without first having to model the whole board. The calculation here was prepared for this write-up using the 6 mil trace and gap dimensions in my design notes.

With equal finger widths and gaps, the voltage pattern repeats over four widths: one positive finger, a gap, one negative finger, and another gap before the next positive finger. A width of 152.4 µm therefore gives a cell 609.6 µm across. I set the electrodes to +0.5 V and −0.5 V, so that there is a 1 V difference between them, and assigned relative permittivities of 1 to the air above and 4.5 to the substrate below. The substrate value is an assumption for this example rather than a measurement of a particular board.

The fingers extend indefinitely out of the section, and the side boundaries repeat the solution into the neighboring cells. This leaves the bus bars, connector pads, coating, and finger ends outside the model. At the upper and lower boundaries I set the normal field to zero, placing those boundaries well away from the copper and then moving them farther out to see whether they affected the result.

![Potential contours around a pair of coplanar electrodes. Positive height is air and negative height is substrate.](/research/capacitive-sensing/assets/ide-potential.png)

*Potential around one repeating cell. The copper lies along the thick red and blue segments at height zero. The field crosses the thin potential contours at right angles, in the direction of decreasing potential.*

The potential in a linear dielectric with no free charge in its volume satisfies

$$
\nabla\cdot(\epsilon\nabla V)=0.
$$

Within either uniform material this reduces to Laplace's equation, but the change in permittivity at the air–substrate interface has to remain part of the calculation. Using a single average permittivity throughout would lose that interface condition. In the Python solver, the domain is divided into a square grid, with each free node coupled to its neighbors according to the permittivity and geometry along the connecting edges. The balance at a node can be written as

$$
\sum_j g_{ij}(V_i-V_j)=0,
$$

where $g_{ij}$ contains that edge's dielectric and geometric terms. The electrode potentials are fixed, and SciPy solves the sparse linear system for the remaining nodes. From this potential distribution, the electric field is

$$
\mathbf{E}=-\nabla V.
$$

Both materials in this example extend well beyond the region where the field is strong. Changing their permittivities changes the charge needed to maintain the electrode voltages. A finite water layer, a coating, or a grounded backing would introduce further boundaries and could also alter the distribution of the field. Those additions would bring the model closer to an assembled sensor, but the simpler section already shows how quickly the alternating pattern becomes weaker as one moves away from the copper.

To follow that change, I took a horizontal slice at each height and calculated the difference between its highest and lowest potential. The difference is 1 V at the electrode plane and falls rapidly above it, as the following plot shows.

![Peak-to-peak potential variation across the periodic cell versus height above the board.](/research/capacitive-sensing/assets/ide-decay.png)

*The potential variation across the cell at increasing height above the electrodes. This describes the calculated potential; a measured response to sample thickness would depend on the sample's properties as well.*

There is a useful comparison with the analytical solution in a uniform region. A sinusoidal component of the boundary potential, with spatial period $\lambda$, has the form

$$
V(x,z)\propto\cos\left(\frac{2\pi x}{\lambda}\right)
\exp\left(-\frac{2\pi z}{\lambda}\right).
$$

For this cell's 609.6 µm period, the longest nonconstant component has a decay length of $\lambda/(2\pi)$, or about 97 µm. The sharper variation near an electrode edge contains shorter spatial wavelengths, which fade more quickly. The relationship gives some physical meaning to the choice of electrode pitch, although it does not define one particular depth at which sensing ends. A depth calculated from field amplitude will differ from one based on stored energy or on the response to an added layer of material, so a comparison between designs needs to use the same definition.

The potential solution also allows the capacitance to be calculated from the stored energy. Per unit length along the fingers, that energy is

$$
U'=\frac{1}{2}\int\epsilon|\nabla V|^2\,dx\,dz,
$$

and the corresponding capacitance is $C'=2U'/(\Delta V)^2$. I evaluated the discrete form of this energy on the grid edges, then repeated the calculation with finer grids and more distant outer boundaries.

| Grid cells across one finger | Boundary distance above and below | Cell capacitance per unit length |
|---|---|---|
| 10 | 6 finger widths | 51.24 pF/m |
| 20 | 6 finger widths | 49.95 pF/m |
| 40 | 6 finger widths | 49.32 pF/m |
| 40 | 10 finger widths | 49.32 pF/m |

The outer boundaries have little influence at these distances, while the representation of the electrode edges still affects the answer. Refining from 20 to 40 cells across a finger changes the calculated capacitance by about 1.3%, which supports reporting roughly 49 pF/m for this cell. The extra decimal places are useful for comparing meshes, but would give a misleading impression of precision if carried into a prediction for a physical board.

This result belongs to a repeating cell with two electrode gaps and is expressed per meter of finger length. Relating it to a board requires the overlap length and the number of repeated cells, with the finite ends still to be accounted for. The distinction between individual fingers and finger pairs matters here, particularly when comparing the numerical model with a formula that uses a different counting convention. Igreja and Dias's [2004 paper](https://docentes.fct.unl.pt/cmd/publications/analytical-evaluation-interdigital-electrodes-capacitance-multi-layered-structure) provides a separate analytical treatment of multilayer electrodes using conformal mapping; the finite-difference calculation here does not implement that model.

For the sensor itself, the next comparison would be with the air capacitance measured on the assembled board. Adding the actual coating and sample thickness would account for more of the dielectric structure, while the pads, wiring, and finger ends would explain contributions absent from this repeating section. That would give the field calculation a measured reference before using it to interpret a change caused by water or ice.

The [calculation script](/research/capacitive-sensing/scripts/analyze.py), [mesh results](/research/capacitive-sensing/data/ide-convergence.csv), and [height profile](/research/capacitive-sensing/data/ide-decay.csv) accompany this example.

A [downloadable archive](/research/capacitive-sensing/reproduce.zip) contains the files and reproduction instructions.
