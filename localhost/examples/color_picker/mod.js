import {
    O_vec2, 
    O_vec4
} from "https://deno.land/x/vector@0.8/mod.js"
import {
    f_o_canvas_webgl
} from "https://deno.land/x/handyhelpers@3.3/mod.js"
import {
    f_o_trn__relative_to_o_html, 
    f_o_trn__relative_to_o_html__nor
} from "../functions.module.js"

let f_o_js__color_picker = function(
    a_o_js = []
){
    


    // let o_js__color_picker = null;
    // let o ={ o_state: {}};
    // let o_state = o.o_state;
    

    // let s_glsl_rgb_to_hsl = `
    // vec3 f_o_rgb_from_o_hsl( in vec3 c )
    // {
    //     vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    //     return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    // }
    // `;

    // let s_id_canvas = `color_picker_canvas`
    // o_js__color_picker = {
    //     f_o_jsh: function(){
    //         return {
    //             id: `${s_id_canvas}`
    //         }
    //     }
    // }
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
    // Object.assign(o_js__color_picker, o);
    let o_state = {
        s_color_border:`#f00`,
        s_border_radius: '50%',
        o_scl: new O_vec2(500),
        b_pointer_down: false,
        o_trn_nor_pick: new O_vec2(0.5),
        o_scl_pick: new O_vec2(20),
        o_rgba_color_pick: new O_vec4()
    }
    window.o_state_col = o_state

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
        uniform vec2 o_trn_nor_pick;
        uniform vec4 o_rgba_color_pick;

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
            float n_tau = 6.2831;
            vec2 o = o_trn_nor_pixel-.5;
            float n_ang_nor = fract(atan(o.y, o.x)/n_tau);
            float n_thickness_border = 0.3;
            float n_dist = length(o)*(2.+n_thickness_border);
            float n_border = clamp(smoothstep(0.85, 1.0, n_dist), 0., 1.);
            float n_radius = 0.02;
            vec2 o_trn_nor_pick_yflipped = vec2(o_trn_nor_pick.x, 1.-o_trn_nor_pick.y);
            vec4 o_donut_pick = f_o_donut_with_border((o_trn_nor_pick_yflipped-o_trn_nor_pixel)*9.);
            float n_d2 = abs(length(o-o_trn_nor_pick_yflipped+.5)-n_radius);
            n_d2 = smoothstep(0.14, 0.05, n_d2*10.);
            vec3 o_col_pick = n_d2*o_rgba_color_pick.xyz;
            vec3 o_col_palette = f_o_rgb_from_hsl(
                vec3(
                    n_ang_nor, 
                    1., 
                    n_dist
                )
            );
            fragColor = vec4(
                +o_col_palette*(1.-n_border)
                +n_border*o_rgba_color_pick.xyz,// (1.-n_d2)*o_col_palette,
                1.
            );
            float n2 = clamp(o_donut_pick.z,0.,1.);
            fragColor*=(1.-n2);
            // fragColor+=vec4(vec3(o_donut_pick.w*o_rgba_color_pick.xyz),0.);
            fragColor+=vec4(vec3(o_donut_pick.z*o_rgba_color_pick.xyz),1.);
            fragColor*=vec4(vec3(1.-o_donut_pick.w),1.);
            if(n_dist<0.4){
                fragColor+=vec4(vec3(o_donut_pick.w),1.);
            }
        }
        `, 
        o_state.o_scl[0], 
        o_state.o_scl[1]
    )

    document.body.appendChild(o_canvas);
    o_canvas.f_render({
        o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp, 
    });
    
    return f_o_js_from_s_name(
        'o_everything', 
        {
            o_state,
            f_o_jsh: async function(){

                console.log(o_state.s_color_border)

                return {
                    style: `
                    position:relative;
                    width: ${o_state.o_scl.n_x}px;
                    height: ${o_state.o_scl.n_y}px;
                    user-select: none;
                    `, 
                    a_o: [
                    
                        // f_o_js_from_s_name(
                        //     'o_js__pick', {
                        //         f_o_jsh: function(){
                        //             return {
                        //                 style: `
                        //                     position: absolute; 
                        //                     left: ${o_state.o_trn_nor_pick.n_x*100}%;
                        //                     top: ${o_state.o_trn_nor_pick.n_y*100}%;
                        //                     width:${o_state.o_scl_pick.n_x}px; 
                        //                     height:${o_state.o_scl_pick.n_y}px;
                        //                     border: 1px solid white;
                        //                     outline: 1px solid black;
                        //                     transform:translate(-50%,-50%);
                        //                     background-color: ${o_state.s_color_border};
                        //                     z-index:1;
                        
                        //                 `,
                        //                 // this element will be infront of the cursor and get the pointer events
                        //                 onpointerup: ()=>{o_state.b_pointer_down = false;console.log('up')},
                        //                 onpointerdown: ()=>{o_state.b_pointer_down = true;console.log('down')},
                        //             }
                        //         }
                        //     }
                        // ),
                        f_o_js_from_s_name(
                            'o_js__canvas', 
                            {
                                f_o_jsh: function(){
                                    return                         {
                                        onpointerup: ()=>{o_state.b_pointer_down = false;console.log('up')},
                                        onpointerdown: ()=>{o_state.b_pointer_down = true;console.log('down')},
                                        onmousemove: function(o_e){
                                            if(o_state.b_pointer_down){
                                                o_state.o_trn_nor_pick = new O_vec2(f_o_trn__relative_to_o_html__nor(
                                                    new O_vec2(o_e.clientX,o_e.clientY),
                                                    o_e.target
                                                ));
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
                                                console.log('read out image data')
                                                console.log(a_n_u8__rgba_image_data); // 
                                                o_state.o_rgba_color_pick = new O_vec4(...a_n_u8__rgba_image_data).div(255);
                                                // o_o_js?.o_js__pick?._f_render();
                                                // o_o_js?.o_everything?._f_render();
                                                o_state.s_color_border = `rgba(${o_state.o_rgba_color_pick[0]*255}, ${o_state.o_rgba_color_pick[1]*255},${o_state.o_rgba_color_pick[2]*255}, ${o_state.o_rgba_color_pick[2]})`
                                                // hsla(240,100%,50%,0.05) 
            
                                                o_canvas.f_render({
                                                    o_trn_nor_pick: o_state.o_trn_nor_pick.a_n_comp,
                                                    o_rgba_color_pick: o_state.o_rgba_color_pick.a_n_comp
                                                });
                                                // o_o_js?.o_js__pick?._f_update()
                                                // o_o_js?.o_everything?._f_update();
                                                o_o_js?.o_js__canvas?._f_update()
                                            }
                                            
                                            o_e.stopPropagation()
                                            o_e.preventDefault()
                                        }, 
            
                                        // ondragstart: (o_e)=>{return o_e.preventDefault()},
                                        style: `
                                        border-radius: ${o_state.s_border_radius};
                                        `,
                                        s_tag: "img", 
                                        src: o_canvas.toDataURL(), 
                                        draggable: 'false'
            
                                    }
                                }
                            }
                        )

                    ]
                }
            }
        }
    )
}
export {
    f_o_js__color_picker
}