export function drawArrow(ctx: CanvasRenderingContext2D, from: Coordinates, to: Coordinates, color: string) {
	var headlen = 10;
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	var angle = Math.atan2(dy, dx);
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
	ctx.moveTo(to.x, to.y);
	ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	ctx.stroke();
}