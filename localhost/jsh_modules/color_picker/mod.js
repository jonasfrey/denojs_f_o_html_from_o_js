import {
    O_vec2, 
    O_vec3, 
    O_vec4
} from "https://deno.land/x/vector@0.8/mod.js"

import {
    f_o_canvas_webgl
} from "https://deno.land/x/handyhelpers@3.3/mod.js"
import {
    f_o_trn__relative_to_o_html, 
    f_o_trn__relative_to_o_html__nor
} from "../functions.module.js"

class O_color_format{
    constructor(
        s_name,
        f_o_hsl_from_o,
        f_o_from_o_hsl,
        f_s_css_string,
        o_vec4_current_value
    ){
        this.s_name = s_name
        this.f_o_hsl_from_o = f_o_hsl_from_o
        this.f_o_from_o_hsl = f_o_from_o_hsl
        this.f_s_css_string = f_s_css_string
        this.o_vec4_current_value = o_vec4_current_value
    }
}
const { abs, min, max, round } = Math;

let f_n_rgb__from_pqt = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

let f_o_rgb__from_hsl = function(h, s, l) {
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = f_n_rgb__from_pqt(p, q, h + 1/3);
      g = f_n_rgb__from_pqt(p, q, h);
      b = f_n_rgb__from_pqt(p, q, h - 1/3);
    }
  
    return new O_vec3(r,g,b);
  }
  

let f_o_hsl__from_rgb = function(r, g, b) {
    // (r /= 255), (g /= 255), (b /= 255);
    const vmax = max(r, g, b), vmin = min(r, g, b);
    let h, s, l = (vmax + vmin) / 2;

    if (vmax === vmin) {
        return [0, 0, l]; // achromatic
    }

    const d = vmax - vmin;
    s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
    if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (vmax === g) h = (b - r) / d + 2;
    if (vmax === b) h = (r - g) / d + 4;
    h /= 6;

    return new O_vec3(h, s, l);
}

let f_o_js = function(
    o_state
){

    let s_glsl_rgb_to_hsl = `
    vec3 f_o_rgb_from_o_hsl( in vec3 c )
    {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
    `;

    let s_id_canvas = `color_picker_canvas`

    let a_o_color_format = [
        new O_color_format(
            'rgb', 
            (o)=>{
                return f_o_hsl__from_rgb(o);
            }, 
            (o_hsl)=>{
                return f_o_rgb__from_hsl(o_hsl)
            }, 
            (o, n_alpha_nor)=>{
                return `rgba(${Math.round(o[0]*255)},${Math.round(o[1]*255)},${Math.round(o[2]*255)},${n_alpha_nor})`;
            }, 
            new O_vec4()
        ),
        new O_color_format(
            'hsl', 
            (o)=>{
                return o
            }, 
            (o_hsl)=>{
                return o_hsl
            }, 
            (o, n_alpha_nor)=>{
                return `hsla(${Math.round(o[0]*360)},${Math.round(o[1]*100)}%,${Math.round(o[2]*100)}%,${n_alpha_nor})`;
            },
            new O_vec4()
        )
    ]
    let o = Object.assign(
        o_state, 
        {
            o_color__hsl:
                (o_state.o_color__hsl) 
                    ? o_state.o_color__hsl
                    : new O_vec2(0,0,0),

            s_color_border:
                (o_state.s_color_border) 
                        ? o_state.s_color_border
                        : `#f00`,
            o_scl:
                (o_state.o_scl) 
                        ? o_state.o_scl
                        : new O_vec2(500),
            b_pointer_down:
                (o_state.b_pointer_down) 
                        ? o_state.b_pointer_down
                        : false,
            o_trn_nor_pick:
                (o_state.o_trn_nor_pick) 
                        ? o_state.o_trn_nor_pick
                        : new O_vec2(0.5),
            o_scl_pick:
                (o_state.o_scl_pick) 
                        ? o_state.o_scl_pick
                        : new O_vec2(20),
            o_rgba_color_pick:
                (o_state.o_rgba_color_pick) 
                        ? o_state.o_rgba_color_pick
                        : new O_vec4(),
            
            a_o_color_format:
                (o_state.a_o_color_format) 
                        ? o_state.a_o_color_format
                        : a_o_color_format,
            o_color_format:
                (o_state.o_color_format) 
                        ? o_state.o_color_format
                        : a_o_color_format[0],
            n_alpha_nor:
                (o_state.n_alpha_nor) 
                        ? o_state.n_alpha_nor
                        : 1.
        }
    )
    let o_
    let s_glsl_o_hsl_from_o_trn = `
        float n_dist = length(o_trn);
        float n_sat = 0.5;
        float n_hue = fract(atan(o_trn.y, o_trn.x)/n_tau);
    `
    let s_glsl_o_trn_from_o_hsl = `
        
    `
    let o_canvas = f_o_canvas_webgl(
        `#version 300 es
        in vec4 a_o_vec_position_vertex;
        out vec2 o_trn_nor_pixel;
        void main() {
            gl_Position = a_o_vec_position_vertex;
            o_trn_nor_pixel = (a_o_vec_position_vertex.xy + 1.0) / 2.0; // Convert from clip space to texture coordinates
        }`,
        `#version 300 es
        precision highp float;
        in vec2 o_trn_nor_pixel;
        out vec4 fragColor;
        // data from js
        uniform float n_alpha_nor;
        uniform vec2 o_trn_nor_pick;
        uniform vec4 o_rgba_color_pick;
        vec3 f_o_hsl_from_o_trn(in vec2 o_trn){
            float n_tau = 6.2831;
            float n_dist = length(o_trn);
            float n_sat = 0.5;
            float n_hue = fract(atan(o_trn.y, o_trn.x)/n_tau);
            return vec3(n_hue, n_sat, n_dist);
        }
        vec3 f_o_rgb_from_hsl( in vec3 c )
        {
            vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        
            return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
        }
        
        vec4 f_o_donut_with_border(vec2 o_trn_px){
            float n = abs(length(o_trn_px)-0.25);
            float n_outer = smoothstep(0.12,0.1, n);
            float n_inner = smoothstep(0.1,0.05, n);
            float n_res = n_outer - n_inner;
            return vec4(n, n_outer, n_inner, n_res);
        }
        void main() {
            vec2 o = (o_trn_nor_pixel-.5)*2.;
            vec3 o_hsl = f_o_hsl_from_o_trn(o);
            vec3 o_rgb = f_o_rgb_from_hsl(o_hsl);
            fragColor = vec4(o_rgb, 1.);
            vec2 o_2 = floor(o_trn_nor_pixel * 20.);
            float n = float(mod(o_2.x, 2.)==mod(o_2.y,2.));
            n *= 0.2;
            vec3 o_rgb2 = f_o_rgb_from_hsl(
                vec3(
                    o_trn_nor_pixel.x, 
                    1., 
                    o_trn_nor_pixel.y
                )
            );

            vec3 o_color_background = vec3(n);
            vec3 o_color_overlay = o_rgb2;
            vec3 o_color_result = n_alpha_nor * o_color_overlay + (1.-n_alpha_nor) * o_color_background;


            fragColor = vec4(o_color_result, 1.);
        }
        `,
        o_state.o_scl[0], 
        o_state.o_scl[1]
    )
    // let o_el_canvas = document.querySelector(`#${s_id_canvas}`);
    // o_el_canvas?.parentElement?.replaceChild(
    //     o_canvas_hsl, 
    //     o_el_canvas
    // );
    
    // o_canvas_hsl.f_render(0)
    // o_canvas_hsl.onclick = function(o_e){
    //     let o_trn_mousedown_relative = f_o_trn__relative_to_o_html(
    //         new O_vec2(o_e.clientX, o_e.clientY),
    //         o_e.target
    //     );
    //     // console.log(o_trn_mousedown_relative)
    //     // const x = e.offsetX;
    //     // const y = e.offsetY;
    //     let ctx = o_canvas_hsl.getContext('webgl', { premultipliedAlpha: false })
    //     console.log(ctx)
    //     let a = new Uint8Array(4);
    //     let v = ctx.readPixels( 
    //         // ...o_trn_mousedown_relative.a_n_comp,
    //         20, 
    //         20,
    //          1,
    //          1,
    //          ctx.RGBA,
    //          ctx.UNSIGNED_BYTE,
    //          a
    //     );
    //     console.log(a,v)
    //     // const pixel = o_canvas_hsl.getContext('webgl').getImageData(
    //     //     ...o_trn_mousedown_relative.a_n_comp,
    //     //     1, 1
    //     // );
    //     // console.log(pixel)
    //     // const data = pixel.data;
    //     // const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    //     // console.log(rgba); // Logs the clicked pixel color

    // }
    // document.body.appendChild(o_canvas);
    // o_canvas.f_render({
    //     o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp, 
    // });
    let f_s_rgba_from_o_rgb =(o)=>{
        return `rgba(${o[0]}, ${o[1]}, ${o[2]}, 1.)`
    }

    let f_update_color_from_mouse = ()=>{
        console.log(o_state.o_trn_nor_pick)
        let o_ctx = o_canvas.getContext("webgl2", {preserveDrawingBuffer: true});
        let n_pixels = 1;
        let n_channels = 4;
        let a_n_u8__rgba_image_data = new Uint8Array(n_pixels*n_channels);
        let o_trn_read = new O_vec2(
            o_state.o_trn_nor_pick.n_x*o_state.o_scl.n_x, 
            // read starts from lower left corner!
            (1.-o_state.o_trn_nor_pick.n_y)*o_state.o_scl.n_y, 
        )
        o_ctx.readPixels(
            ...o_trn_read.a_n_comp,
            1,
            1,
            o_ctx.RGBA,
            o_ctx.UNSIGNED_BYTE,
            a_n_u8__rgba_image_data,
        );
        // console.log('read out image data')
        // console.log(a_n_u8__rgba_image_data); // 
        o_state.o_rgba_color_pick = new O_vec4(...a_n_u8__rgba_image_data).div(255);
        // o_o_js?.o_js__pick?._f_render();
        // o_o_js?.o_everything?._f_render();
        o_state.s_color_border = `rgba(${o_state.o_rgba_color_pick[0]*255}, ${o_state.o_rgba_color_pick[1]*255},${o_state.o_rgba_color_pick[2]*255}, ${o_state.o_rgba_color_pick[2]})`
        // hsla(240,100%,50%,0.05) 

        o_canvas.f_render({
            n_alpha_nor: o_state.n_alpha_nor,
            o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp,
            o_rgba_color_pick: o_state.o_rgba_color_pick.a_n_comp
        });
        o.o_color__hsl = f_o_hsl__from_rgb(
            o_state.o_rgba_color_pick[0],
            o_state.o_rgba_color_pick[1],
            o_state.o_rgba_color_pick[2],
        )
        o?.o_js__pick?._f_update()
        // o_o_js?.o_everything?._f_update();

        o?.o_js__other?._f_render();

        // o_state?.o_js__canvas?._f_update()

    }
    window.o_state = o
    let n_id_interval = window.setInterval(
        ()=>{
            if(o_canvas?.parentElement?.id != s_id_canvas){
                console.log(o_canvas.parentElement)
                o_canvas.remove();
                document.querySelector(`#${s_id_canvas}`)?.appendChild(
                    o_canvas
                )
                clearInterval(n_id_interval)
                o_canvas.f_render({
                    n_alpha_nor: o_state.n_alpha_nor,
                    o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp,
                    o_rgba_color_pick: o_state.o_rgba_color_pick.a_n_comp
                });
            }
        }, 100
    );
    let o_js =  Object.assign(
        o, 
        {
            o_js: {    
                f_o_jsh: async function(){
                    
                    return {
                        a_o: [
                            Object.assign(
                                o, 
                                {
                                    o_js__other: {
                                        f_o_jsh: ()=>{
                                            
                                            return {
                                                class: 'inputs',
                                                a_o: [
                                                    {
                                                        innerText: o.s_color_format,
                                                        // style: `color: ${}`
                                                    },
                                                    Object.assign(
                                                        o, 
                                                        {
                                                            o_js__alpha: {
                                                                f_o_jsh:()=>{
                                                                    return {
                                                                        style: "width:100%;height: 1rem",
                                                                        a_o: [
                                                                            {
                                                                                s_tag: 'input', 
                                                                                type: 'range', 
                                                                                min: 0, 
                                                                                max: 1, 
                                                                                step: 0.01, 
                                                                                value: o.n_alpha_nor, 
                                                                                oninput: (o_e)=>{
                                                                                    o.n_alpha_nor = parseFloat(o_e.target.value);
                                                                                
                                                                                    o_canvas.f_render({
                                                                                        n_alpha_nor: o_state.n_alpha_nor,
                                                                                        o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp,
                                                                                        o_rgba_color_pick: o_state.o_rgba_color_pick.a_n_comp
                                                                                    });
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ).o_js__alpha,
                                                    
                                                    ...[0,1,2].map(n=>{
                                                        return {
                                                            s_tag: 'input', 
                                                            type: 'number', 
                                                            step: 0.01, 
                                                            min: 0, 
                                                            max:1, 
                                                            value: o.o_color_format.o_vec4_current_value[n],
                                                            oninput: (o_e)=>{
                                                                let n = parseFloat(o_e.target.value);
                                                                n = Math.max(0, n)
                                                                n = Math.min(1, n)
                                                                o.o_color_format.o_vec4_current_value[n] = n
                                                                // o_canvas.f_render({
                                                                //     o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp,
                                                                //     o_rgba_color_pick: o_state.o_rgba_color_pick.a_n_comp
                                                                // });
                                                            } 
                                                        }
                                                    }),
                                                    {
                                                        s_tag: 'select', 
                                                        a_o: a_o_color_format.map(s=>{
                                                            return {
                                                                s_tag: 'option',
                                                                innerText: s, 
                                                                value: s, 
                                                            }
                                                        }), 
                                                        onchange: (o_e)=>{
                                                            o_state.o_color_format = o.a_o_color_format.find(o2=>o2.s_name == o_e.target.value)
                                                            o.o_js__other._f_render()
                                                        }

                                                    }
                                                ]

                                            }
                                        }
                                    }
                                }
                            ).o_js__other,
                            {
                                a_o: [
                                    {
                                        onpointerup: ()=>{
                                            o_state.b_pointer_down = false;
                                            console.log('up')
                                        },
                                        onpointerdown: (o_e)=>{
                                            o_state.b_pointer_down = true;
                                            console.log('down')
                                            o_state.o_trn_nor_pick = new O_vec2(f_o_trn__relative_to_o_html__nor(
                                                new O_vec2(o_e.clientX,o_e.clientY),
                                                o_e.target
                                            ));
                                            f_update_color_from_mouse()
        
                                        },
                                        onmousemove: function(o_e){
                                            console.log(`mousemove on canvas ${new Date()}`)
        
                                            if(o_state.b_pointer_down){
                                                o_state.o_trn_nor_pick = new O_vec2(f_o_trn__relative_to_o_html__nor(
                                                    new O_vec2(o_e.clientX,o_e.clientY),
                                                    o_e.target
                                                ));
                                                f_update_color_from_mouse()
                                            }
                                            o_e.stopPropagation()
                                            o_e.preventDefault()
                                        }, 
                                        id: s_id_canvas,
                                        style: `
                                        position:relative;
                                        width: ${o_state.o_scl.n_x}px;
                                        height: ${o_state.o_scl.n_y}px;
                                        user-select: none;
                                        `, 
                                        a_o: [
                                            Object.assign(
                                                o, 
                                                {
                                                    o_js__pick: {
                                                        f_o_jsh: function(){
                                                            return {
                                                                style: `
                                                                    position: absolute; 
                                                                    left: ${o_state.o_trn_nor_pick.n_x*100-3}%;
                                                                    top: ${o_state.o_trn_nor_pick.n_y*100-3}%;
                                                                    width:${o_state.o_scl_pick.n_x}px; 
                                                                    height:${o_state.o_scl_pick.n_y}px;
                                                                    border: 1px solid white;
                                                                    border-radius: 20%;
                                                                    outline: 1px solid black;
                                                                    transform:translate(-50%,-50%);
                                                                    background-color: ${o_state.s_color_border};
                                                                    z-index:1;
                                                
                                                                `,
                                                                // this element will be infront of the cursor and get the pointer events
                                                                onpointerup: ()=>{o_state.b_pointer_down = false;console.log('up')},
                                                                onpointerdown: ()=>{o_state.b_pointer_down = true;console.log('down')},
                                                            }
                                                        }
                                                    }
                                                }
                                            ).o_js__pick,
                                        ]
                                    },
                                ]
                            }
                        ]
                    }

                }
            }
        }
    ).o_js
    return o_js; 
}
export {
    f_o_js
}