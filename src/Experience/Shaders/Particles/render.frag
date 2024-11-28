uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;

varying float size;
void main()
{
    // Use the `big` color for particles based on size
    if (size > 1.0) {
        gl_FragColor = vec4(big * vec3(1.0 - length(gl_PointCoord.xy - vec2(0.5))) * 1.5, 0.95);
    } else {
        gl_FragColor = vec4(small, 0.8);
    }
}
