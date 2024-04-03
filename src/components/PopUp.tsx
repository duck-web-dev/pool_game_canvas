import React, { FC, useState } from "react";
import styles from "../css/popup.module.css";
import { PoolBallColorValues } from "../lib/utils";

const PopUp: FC<{ pos: Coordinates, defaultColor: PoolBallColor, update: (color: PoolBallColor) => void, close: () => void }> = ({ pos, defaultColor, update, close }) => {
	// console.log(styles)
	console.log(defaultColor);
	let [curColor, setCurColor] = useState<PoolBallColor>(defaultColor);
	return (<>
		<div className={styles.popup} style={{top: pos.y - 20, left: pos.x + 30}}>
			<span className={styles.title}>Select Ball Color</span>
			<div className={styles.body}>
				<span>Please select color:</span>
				<select
					value={curColor} 
					onChange={(e) => {
						let color = e.target.value as PoolBallColor;
						setCurColor(color);
						update(color);
					}}
				>
					{PoolBallColorValues.map(color => (
						<option 
							value={color} key={color}
							style={{background: color}}
						>{color}</option>
					))}
				</select>
				<button onClick={close}>Close</button>
			</div>
		</div>
	</>);
}	

export default PopUp;