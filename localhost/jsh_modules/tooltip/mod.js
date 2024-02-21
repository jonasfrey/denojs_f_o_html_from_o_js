import {
    f_add_css,
    f_s_css_prefixed,
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    O_vec2
} from "https://deno.land/x/vector@1.4/mod.js"
import { 
    f_s_css_class_from_s_uuid
} from "./../functions.module.js"

let s_class = 'tooltip';
let s_css_class_uuid_module_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());

let f_v_o_closest_tooltip = function(o_el){
    while (o_el) {
      // Check if the element has the 'data_tooltip' attribute
      if (o_el.hasAttribute('data_tooltip')) {
        // If found, return the element
        return o_el;
      }
      // Move to the parent element
      o_el = o_el.parentElement;
    }
    // If no element with 'data_tooltip' attribute found, return null
    return null;
}
let f_o_js = function(
    o_state = {}
){
    let s_css_class_uuid_function_scope = f_s_css_class_from_s_uuid(crypto.randomUUID());

    Object.assign(o_state, {
		//
		o_js: {
			f_o_jsh:
				function () {
					return {
						class: [
							s_class,
							s_css_class_uuid_module_scope,
							s_css_class_uuid_function_scope,
						].join(
							" "
						),
                        innerHTML: o_state.s_html, 
                        style: [
                            `position: fixed`,
                            `left: ${o_state.o_trn_px.n_x}px`,
                            `top: ${o_state.o_trn_px.n_y}px`,
                            `z-index: ${o_state.n_z_index}`,
                            `display: ${(o_state.b_display) ? 'block' : 'none'}`
                        ].join(';')
					};
				},
		},
		//
		s_html:
			o_state.s_html
				? o_state.s_html
				: "",
        o_trn_px:
            o_state.o_trn_px
                ? o_state.o_trn_px
                : new O_vec2(0),
        o_scl_px:
            o_state.o_scl_px
                ? o_state.o_scl_px
                : new O_vec2(0),
        o_scl_px_window:
            o_state.o_scl_px_window
                ? o_state.o_scl_px_window
                : new O_vec2(0),
        o_trn_px_margin:
            o_state.o_trn_px_margin
                ? o_state.o_trn_px_margin
                : new O_vec2(5),
        n_z_index:
            o_state.n_z_index
                ? o_state.n_z_index
                : 9999999,
        b_display:
            o_state.b_display
                ? o_state.b_display
                : false,
        //
		s_css_class_uuid_module_scope:
			o_state.s_css_class_uuid_module_scope
				? o_state.s_css_class_uuid_module_scope
				: s_css_class_uuid_module_scope,
		s_css_class_uuid_function_scope:
			o_state.s_css_class_uuid_function_scope
				? o_state.s_css_class_uuid_function_scope
				: s_css_class_uuid_function_scope,
	});
    window.addEventListener('pointermove', async (o_e)=>{
        let v_o = f_v_o_closest_tooltip(o_e.target);
        // console.log(v_o)
        o_state.b_display = v_o;
        let o_trn_px_mouse = new O_vec2(
            o_e.clientX,
            o_e.clientY,
        );
        if(v_o){
            o_state.s_html = v_o.getAttribute('data_tooltip')
            
            o_state.o_trn_px = o_trn_px_mouse.clone().add(o_state.o_trn_px_margin)
        }
        let o = document.querySelector(`.${s_class}.${s_css_class_uuid_module_scope}`);
        let o_bounding_rect = o?.getBoundingClientRect();
        o_state.o_scl_px = new O_vec2(o_bounding_rect.width, o_bounding_rect?.height);
        o_state.o_scl_px_window = new O_vec2(
            window.innerWidth, 
            window.innerHeight
        );
        let o_delta_1 = o_trn_px_mouse.abs();
        let o_delta_2 = o_trn_px_mouse.sub(o_state.o_scl_px_window).abs()
        // console.log(o_delta_1)
        // console.log(o_delta_2)
        let o_trn_px_2 = o_trn_px_mouse.sub(o_state.o_scl_px).sub(o_state.o_trn_px_margin)
        if(o_delta_1.n_x > o_delta_2.n_x){
            o_state.o_trn_px.n_x = o_trn_px_2.n_x;
        }
        if(o_delta_1.n_y > o_delta_2.n_y){
            o_state.o_trn_px.n_y = o_trn_px_2.n_y;
        }

        await o_state.o_js._f_update();

    })
    return o_state.o_js
}
// css for only this module
let s_css = `
.${s_class}.${s_css_class_uuid_module_scope}{
    padding: 1rem; 
    font-family:sans;
    border-radius:3px; 
    background: rgba(0,0,0,0.6);
    color: #eee !important;
}
${
    f_s_css_prefixed(
        `
            .clickable:hover{
                background: blue;
            }
        `,
        `.${s_css_class_uuid_module_scope}`
    )
}
`

export {
    s_css,
    f_o_js
}