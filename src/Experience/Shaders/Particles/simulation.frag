#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// simulation

varying vec2 vUv;
uniform sampler2D uTexture;
uniform lowp float timer;
uniform lowp float frequency;
uniform lowp float amplitude;
uniform lowp float maxDistance;
uniform lowp float uBass;
uniform lowp float uMid;
uniform lowp float uTreble;

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float noise(vec2 v)
{
    const mediump vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
    // First corner
    mediump vec2 i  = floor(v + dot(v, C.yy) );
    mediump vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    mediump vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    mediump vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    mediump vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    mediump vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    mediump vec3 x = 2.0 * fract(p * C.www) - 1.0;
    mediump vec3 h = abs(x) - 0.5;
    mediump vec3 ox = floor(x + 0.5);
    mediump vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    mediump vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Curl noise function for solar flares
vec3 curl(float x, float y, float z) {
    float eps = 1.0;
    
    vec3 curl = vec3(0.0);
    
    // Find rate of change in YZ plane
    float n1 = noise(vec2(y + eps, z));
    float n2 = noise(vec2(y - eps, z));
    float n3 = noise(vec2(y, z + eps));
    float n4 = noise(vec2(y, z - eps));
    
    // Find rate of change in XZ plane
    float n5 = noise(vec2(x + eps, z));
    float n6 = noise(vec2(x - eps, z));
    float n7 = noise(vec2(x, z + eps));
    float n8 = noise(vec2(x, z - eps));
    
    // Find rate of change in XY plane
    float n9 = noise(vec2(x + eps, y));
    float n10 = noise(vec2(x - eps, y));
    float n11 = noise(vec2(x, y + eps));
    float n12 = noise(vec2(x, y - eps));
    
    // Calculate curl
    curl.x = (n4 - n3 + n11 - n12) / (4.0 * eps);
    curl.y = (n8 - n7 + n9 - n10) / (4.0 * eps);
    curl.z = (n2 - n1 + n5 - n6) / (4.0 * eps);
    
    return curl;
}

void main() {
    vec2 uv = vUv;
    vec4 pos = texture2D(uTexture, uv);
    
    // Enhanced strand behavior - more particles become strands
    float strandFactor = step(0.85, fract(uv.x * 12.0 + uv.y * 6.0 + timer * 0.05));
    float strandPhase = noise(vec2(floor(uv.x * 12.0), floor(uv.y * 6.0)));
    
    // Create multiple types of strands with different behaviors
    float strandType = fract(strandPhase * 3.0); // 0-1 range for different behaviors
    
    // Dynamic whip-like paths with more dramatic movements
    vec3 strandPath = vec3(
        sin(timer * 0.5 + strandPhase * 6.28) * (2.0 + uBass + sin(timer * 0.2) * 1.5),
        cos(timer * 0.3 + strandPhase * 6.28) * (2.0 + uMid + cos(timer * 0.15) * 1.5),
        sin(timer * 0.4 + strandPhase * 6.28) * (1.5 + uTreble + sin(timer * 0.25) * 1.5)
    );
    
    // Create multiple vortex centers
    vec3 vortex1 = vec3(sin(timer * 0.5), cos(timer * 0.3), sin(timer * 0.4));
    vec3 vortex2 = vec3(cos(timer * 0.4), sin(timer * 0.5), cos(timer * 0.3));
    
    float dist1 = length(pos.xyz - vortex1);
    float dist2 = length(pos.xyz - vortex2);
    
    if (strandFactor > 0.0) {
        // Different behaviors based on strand type
        if (strandType < 0.33) {
            // Whip-like strands that flare out dramatically
            float whipPhase = timer * (1.0 + uBass * 2.0) + strandPhase * 10.0;
            vec3 whipDir = normalize(vec3(
                sin(whipPhase),
                cos(whipPhase * 0.7),
                sin(whipPhase * 1.3)
            ));
            float whipStrength = (1.0 + sin(timer * 2.0 + strandPhase * 10.0)) * (1.0 + uBass * 3.0);
            pos.xyz += whipDir * whipStrength * 0.1;
            
        } else if (strandType < 0.66) {
            // Calmer, flowing strands
            vec3 flowForce = normalize(strandPath - pos.xyz) * (0.5 + uMid * 0.3);
            vec3 rotationAxis = normalize(cross(pos.xyz, vec3(0.0, 1.0, 0.0)));
            vec3 spiral = cross(normalize(pos.xyz), rotationAxis) * (0.3 + sin(timer + strandPhase * 5.0) * 0.2);
            pos.xyz += (flowForce + spiral) * 0.05;
            
        } else {
            // Solar flare-like strands
            vec3 flareBase = normalize(pos.xyz) * (maxDistance * 0.8);
            vec3 flareTip = flareBase * (1.5 + uBass + sin(timer * 0.5 + strandPhase * 4.0));
            float flarePhase = timer * (0.5 + uBass) + strandPhase * 8.0;
            float flarePull = (1.0 + sin(flarePhase)) * 0.5;
            pos.xyz = mix(pos.xyz, flareTip, flarePull * 0.1);
        }
        
        // Add some chaos to all strands
        vec3 chaos = curl(
            pos.x * frequency * 2.0 + timer * 0.2,
            pos.y * frequency * 2.0 + timer * 0.25,
            pos.z * frequency * 2.0 + timer * 0.22
        ) * (0.3 + uTreble * 0.3 + sin(timer + strandPhase * 3.0) * 0.2);
        
        pos.xyz += chaos * amplitude * 0.3;
        
        // Store strand type in w component for color variation
        pos.w = strandType;
        
    } else {
        // Regular particle behavior
        // Create strand behavior based on UV coordinates
        float strandFactor = step(0.95, fract(uv.x * 8.0 + uv.y * 4.0 + timer * 0.1));
        float strandPhase = noise(vec2(floor(uv.x * 8.0), floor(uv.y * 4.0)));
        
        // Dynamic strand paths
        vec3 strandPath = vec3(
            sin(timer * 0.5 + strandPhase * 6.28) * (2.0 + uBass),
            cos(timer * 0.3 + strandPhase * 6.28) * (2.0 + uMid),
            sin(timer * 0.4 + strandPhase * 6.28) * (1.5 + uTreble)
        );
        
        // Create multiple vortex centers
        vec3 vortex1 = vec3(sin(timer * 0.5), cos(timer * 0.3), sin(timer * 0.4));
        vec3 vortex2 = vec3(cos(timer * 0.4), sin(timer * 0.5), cos(timer * 0.3));
        
        // Calculate distances
        float dist1 = length(pos.xyz - vortex1);
        float dist2 = length(pos.xyz - vortex2);
        
        // Strand behavior
        if (strandFactor > 0.0) {
            // Particles in strands follow more independent paths
            vec3 strandForce = normalize(strandPath - pos.xyz) * (1.0 + uBass * 0.5);
            vec3 rotationAxis = normalize(cross(pos.xyz, vec3(0.0, 1.0, 0.0)));
            vec3 spiral = cross(normalize(pos.xyz), rotationAxis) * (0.5 + uMid * 0.3);
            
            // Add some chaos to strands
            vec3 chaos = curl(
                pos.x * frequency * 2.0 + timer * 0.2,
                pos.y * frequency * 2.0 + timer * 0.25,
                pos.z * frequency * 2.0 + timer * 0.22
            ) * (0.5 + uTreble * 0.5);
            
            pos.xyz += (strandForce + spiral + chaos) * amplitude * 0.5;
        } else {
            // Regular particle behavior
            vec3 force1 = normalize(cross(pos.xyz - vortex1, vec3(0.0, 1.0, 0.0))) * (1.0 / (1.0 + dist1 * 0.1));
            vec3 force2 = normalize(cross(pos.xyz - vortex2, vec3(1.0, 0.0, 0.0))) * (1.0 / (1.0 + dist2 * 0.1));
            
            vec2 noiseCoord = vec2(pos.x * 0.1 + timer * 0.1, pos.y * 0.1 - timer * 0.1);
            vec3 turbulence = vec3(
                noise(noiseCoord + vec2(0.0, timer)) * 2.0 - 1.0,
                noise(noiseCoord + vec2(1.0, timer)) * 2.0 - 1.0,
                noise(noiseCoord + vec2(2.0, timer)) * 2.0 - 1.0
            );
            
            // Calculate curl noise for solar flares
            vec3 curlForce = curl(
                pos.x * frequency + timer * 0.1,
                pos.y * frequency + timer * 0.15,
                pos.z * frequency + timer * 0.12
            ) * (0.8 + uBass * 1.5 + uMid * 0.5);
            
            // Add eruption points
            vec3 eruption1 = vec3(sin(timer * 0.7) * 2.0, cos(timer * 0.5) * 2.0, sin(timer * 0.3) * 2.0);
            vec3 eruption2 = vec3(cos(timer * 0.4) * 2.0, sin(timer * 0.6) * 2.0, cos(timer * 0.8) * 2.0);
            
            float eruptDist1 = length(pos.xyz - eruption1);
            float eruptDist2 = length(pos.xyz - eruption2);
            
            vec3 eruptForce = (normalize(pos.xyz - eruption1) / (1.0 + eruptDist1 * 2.0) +
                               normalize(pos.xyz - eruption2) / (1.0 + eruptDist2 * 2.0)) * uBass * 2.0;
            
            vec3 totalForce = (force1 * (1.0 + uBass * 2.0) + 
                               force2 * (1.0 + uMid * 2.0) + 
                               turbulence * (0.2 + uTreble * 1.0) +
                               curlForce * amplitude +
                               eruptForce) * amplitude;
            
            pos.xyz += totalForce;
        }
    }
    
    // Modified boundary behavior for strands
    float dist = length(pos.xyz);
    if(dist > maxDistance) {
        float angle = atan(pos.y, pos.x);
        float boundaryNoise = noise(vec2(angle * 2.0 + timer * 0.1, timer * 0.2)) * 0.3;
        float adjustedMaxDist = maxDistance * (1.0 + boundaryNoise + uBass * 0.2);
        
        if (strandFactor > 0.0) {
            // Strands can extend much further but with smooth fallback
            float extendedDist = adjustedMaxDist * (2.0 + uBass);
            if (dist > extendedDist) {
                // Smooth return using exponential falloff
                float pullBack = (dist - extendedDist) * 0.1;
                pos.xyz -= normalize(pos.xyz) * pullBack;
            }
        } else {
            // Regular particles stay within boundary
            vec3 normal = normalize(pos.xyz);
            vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
            pos.xyz = normal * adjustedMaxDist + tangent * (0.2 + uMid * 0.1);
        }
    }
    
    gl_FragColor = pos;
}
