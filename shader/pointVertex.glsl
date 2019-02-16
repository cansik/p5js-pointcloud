uniform mat4 projection;
uniform mat4 modelview;

attribute vec4 position;
attribute vec4 color;
attribute vec2 offset;

varying vec4 vertColor;

uniform float colorMix;

uniform float pointScale;
uniform vec4 pointColor;

uniform vec2 res;

void main() {
	vec4 pt = position;

	// scale points
	pt /= pointScale;

	// change color if needed
	vec4 c = mix(color, pointColor, colorMix);

	// apply view matrix
	vec4 pos = modelview * pt;
	vec4 clip = projection * pos;
	vec4 clipped = clip + projection * vec4(offset, 0, 0);

	gl_Position = clipped;
	vertColor = c;
}
