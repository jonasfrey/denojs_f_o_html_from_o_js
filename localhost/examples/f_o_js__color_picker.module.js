import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"
import {
    f_o_canvas_from_vertex_shader
} from "https://deno.land/x/handyhelpers@2.4/mod.js"
import {
    f_o_trn__relative_to_o_html, 
    f_o_trn__relative_to_o_html__nor
} from "./functions.module.js"

let f_o_js__color_picker = function(
    a_o_js = []
){
    
    let o_o_js = {};
    let f_o_js_from_s_name = function(s_name, o){
        if(!o_o_js[s_name]){
            o_o_js[s_name] = o
        }else{
            return o_o_js[s_name]
        }
        return o
    }

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
        o_scl_pick: new O_vec2(5),
    }
    window.o_state_col = o_state

    return f_o_js_from_s_name(
        'o_everything', 
        {
            o_state,
            f_o_jsh: async function(){
                let o_canvas = f_o_canvas_from_vertex_shader(
                    `
                    precision mediump float;
                    varying vec2 o_trn_pixel_nor;
                    uniform float n_t;
                
                    void main() {
                        float n_dist = length(o_trn_pixel_nor-0.5);
                        float n_ang_nor = 0.;
                        float n1 = sin(n_dist*3.*3.+n_t*0.003)*.5+.5;
                        float n2 = sin(n_dist*6.*3.+n_t*0.003)*.5+.5;
                        float n3 = sin(n_dist*9.*3.+n_t*0.003)*.5+.5;
                        gl_FragColor = vec4(
                            n1,
                            n2, 
                            n3,
                            1.
                        );
                    }
                    `,
                    ...o_state.o_scl.a_n_comp
                );
                window.o_canvas = o_canvas
                o_canvas.f_render(window.performance.now())
                document.body.appendChild(o_canvas)
                const gl = o_canvas.getContext("webgl");
                const pixels = new Uint8Array(
                  gl.drawingBufferWidth * gl.drawingBufferHeight * 4,
                );
                gl.readPixels(
                  0,
                  0,
                  gl.drawingBufferWidth,
                  gl.drawingBufferHeight,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  pixels,
                );
                return {
                    style: `
                    position:relative;
                    width: ${o_state.o_scl.n_x}px;
                    height: ${o_state.o_scl.n_y}px;
                    border-radius: ${o_state.s_border_radius};
                    border: 1rem solid ${o_state.s_color_border};
                    user-select: none;
                    `, 
                    a_o: [
                    
                        f_o_js_from_s_name(
                            'o_js__pick', {
                                f_o_jsh: function(){
                                    return {
                                        style: `
                                            position: absolute; 
                                            left: ${o_state.o_trn_nor_pick.n_x*100}%;
                                            top: ${o_state.o_trn_nor_pick.n_y*100}%;
                                            width:${o_state.o_scl_pick.n_x}px; 
                                            height:${o_state.o_scl_pick.n_y}px;
                                            border: 2px solid white;
                                            outline: 2px solid black;
                                            z-index:1;
                        
                                        `,
                                        // this element will be infront of the cursor and get the pointer events
                                        onpointerup: ()=>{o_state.b_pointer_down = false;console.log('up')},
                                        onpointerdown: ()=>{o_state.b_pointer_down = true;console.log('down')},
                                    }
                                }
                            }
                        ),
                        {
                            onpointerup: ()=>{o_state.b_pointer_down = false;console.log('up')},
                            onpointerdown: ()=>{o_state.b_pointer_down = true;console.log('down')},
                            onmousemove: function(o_e){
                                if(o_state.b_pointer_down){
                                    o_state.o_trn_nor_pick = new O_vec2(f_o_trn__relative_to_o_html__nor(
                                        new O_vec2(o_e.clientX,o_e.clientY),
                                        o_e.target
                                    ));

                                    let o_ctx = o_canvas.getContext("webgl", {preserveDrawingBuffer: true});
                                    let a_n_u8__pixel_rgba = new Uint8Array(
                                        4,//n_channels
                                    );

                                    o_ctx.viewport(0, 0, o_canvas.width, o_canvas.height);

                                    o_ctx.readPixels(
                                    // ...o_state.o_trn_nor_pick.mul(
                                    //     o_state.o_scl
                                    // ).to_int().a_n_comp,
                                    200,200,
                                    1,
                                    1,
                                    o_ctx.RGBA,
                                    o_ctx.UNSIGNED_BYTE,
                                    a_n_u8__pixel_rgba,
                                    );
                                    console.log(a_n_u8__pixel_rgba); // Uint8Array

                                    // o_o_js?.o_js__pick?._f_render();
                                    // o_o_js?.o_everything?._f_render();
                                    o_o_js?.o_js__pick?._f_update()
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
                    ]
                }
            }
        }
    )
}
export {
    f_o_js__color_picker
}