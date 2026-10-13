/**
 * Logo de la vitrine — IMPORTÉ depuis le paquet `nodefony`, source unique du
 * logo officiel. Vite le sert en développement et l'émet à empreinte au build
 * de production : c'est l'idiome à suivre pour toute image du front
 * (`import x from "./x.png"`, ou `url(./x.png)` en CSS).
 *
 * Le PNG, et non le SVG source (`nodefony/assets/nodefony-logo.svg`) : Vite
 * inline en data-URI toute image de moins de 4 Ko, et le SVG en fait moins
 * d'un — la vitrine n'exercerait plus le chemin d'un fichier à empreinte.
 *
 * Pour poser ta marque : place ton image à côté (`./logo.png`) et importe-la
 * ici à la place.
 */
import logoUrl from "nodefony/assets/nodefony-logo.png";

export const NODEFONY_LOGO: string = logoUrl;
