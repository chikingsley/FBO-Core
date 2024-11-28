#ifdef GL_ES
precision mediump float;
#endif

//float texture containing the positions of each particle
uniform sampler2D positions;
uniform lowp float uPointSize;
uniform lowp float uPixelRatio;

varying float size;
varying vec3 vPosition;

void main() {
    //the mesh is a normalized square so the uvs = the xy positions of the vertices
    mediump vec3 pos = texture2D(positions, position.xy).xyz;
    
    //pos now contains the position of a point in space that can be transformed
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    mediump vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    mediump vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    
    // Point size calculations can use lowp since they're simple multiplications
    lowp float pointSize = uPixelRatio * uPointSize;
    gl_PointSize = pointSize * (1.0 / -viewPosition.z);
    
    size = gl_PointSize;
    vPosition = position.xyz;
}
