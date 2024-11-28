uniform vec2 nearFar;
uniform vec3 small;
uniform vec3 big;
uniform lowp float uBass;
uniform lowp float uMid;
uniform lowp float uTreble;

varying float size;

// Color utilities
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 center = gl_PointCoord.xy - vec2(0.5);
    float dist = length(center);
    
    // Base alpha with softer falloff
    float alpha = smoothstep(0.5, 0.35, dist);
    
    // Get strand type from position w component
    float strandType = gl_FragCoord.w;
    
    vec3 color;
    if (size > 1.0) {
        if (strandType < 0.33) {
            // Whip-like strands: energetic reds and oranges
            float hue = 0.05 + uBass * 0.1;
            float sat = 0.8 + uMid * 0.2;
            float val = 0.9 + uBass * 0.1;
            color = hsv2rgb(vec3(hue, sat, val));
        } else if (strandType < 0.66) {
            // Flowing strands: cool blues and cyans
            float hue = 0.5 + uMid * 0.1;
            float sat = 0.7 + uTreble * 0.2;
            float val = 0.8 + uMid * 0.2;
            color = hsv2rgb(vec3(hue, sat, val));
        } else {
            // Solar flare strands: yellows and whites
            float hue = 0.15 + uBass * 0.05;
            float sat = 0.6 + uMid * 0.2;
            float val = 0.9 + uBass * 0.1;
            color = hsv2rgb(vec3(hue, sat, val));
        }
        
        // Add subtle glow based on strand type
        float glow = exp(-dist * 3.0) * (0.2 + uMid * 0.1);
        color *= (1.0 + glow * 0.2);
        alpha *= 0.85;
    } else {
        // Core particles: maintain original color with less variation
        color = mix(small, big, 0.5);
        color *= 1.0 + sin(size * 20.0) * 0.1;
        alpha *= 0.95;
    }
    
    // Very subtle brightness variation
    float brightness = 1.0 + (uBass + uMid + uTreble) * 0.15;
    color *= brightness;
    
    // Final color with reduced intensity
    gl_FragColor = vec4(color * vec3(1.0 - dist * 0.2), alpha * 0.7);
}
