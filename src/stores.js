import { writable } from "svelte/store";
import colours from "./utils/colours";

export const data = writable(null);
export const columnData = writable(null);
export const selectedBreaks = writable(null);
export const colourScheme = writable(colours[0].scales[0]);
export const scale = writable("quantiles");
export const breakTicks = writable(6);
export const binTicks = writable(20);
export const showStatistics = writable([]);
export const breaks = writable(null);
export const defaultBeeswarmRadius = writable(null);
export const beeswarmRadius = writable(null);
