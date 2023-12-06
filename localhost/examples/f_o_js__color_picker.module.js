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
    
    let o_js__color_picker = null;
    let o ={ o_state: {}};
    let o_state = o.o_state;
    

    let s_glsl_rgb_to_hsl = `
    vec3 f_o_rgb_from_o_hsl( in vec3 c )
    {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
    `;


    let o_canvas_hsl = f_o_canvas_from_vertex_shader(
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
        500, 
        500
    )


    let s_id_canvas = `color_picker_canvas`
    o_js__color_picker = {
        f_o_jsh: function(){
            return {
                id: `${s_id_canvas}`
            }
        }
    }
    let o_el_canvas = document.querySelector(`#${s_id_canvas}`);
    o_el_canvas?.parentElement?.replaceChild(
        o_canvas_hsl, 
        o_el_canvas
    );
    
    o_canvas_hsl.f_render(0)
    o_canvas_hsl.onclick = function(o_e){
        let o_trn_mousedown_relative = f_o_trn__relative_to_o_html(
            new O_vec2(o_e.clientX, o_e.clientY),
            o_e.target
        );
        // console.log(o_trn_mousedown_relative)
        // const x = e.offsetX;
        // const y = e.offsetY;
        let ctx = o_canvas_hsl.getContext('webgl', { premultipliedAlpha: false })
        console.log(ctx)
        let a = new Uint8Array(4);
        let v = ctx.readPixels( 
            // ...o_trn_mousedown_relative.a_n_comp,
            20, 
            20,
             1,
             1,
             ctx.RGBA,
             ctx.UNSIGNED_BYTE,
             a
        );
        console.log(a,v)
        // const pixel = o_canvas_hsl.getContext('webgl').getImageData(
        //     ...o_trn_mousedown_relative.a_n_comp,
        //     1, 1
        // );
        // console.log(pixel)
        // const data = pixel.data;
        // const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        // console.log(rgba); // Logs the clicked pixel color

    }
    Object.assign(o_js__color_picker, o);
    return o_js__color_picker
}
export {
    f_o_js__color_picker
}