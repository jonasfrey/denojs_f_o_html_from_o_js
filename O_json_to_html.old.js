class O_json_to_html {
    constructor(){
        this.s_prop_name_tag_name = "s_t"
        this.s_prop_name_children_elements = "a_c"
        this.s_prop_name_inner_html = "s_inner_html"
        this.s_prop_name_inner_text = "s_inner_text"
        this.s_link_property_suffix = "<>", 
        this.s_default_tag_name = "div"
        this.s_default_o_data_first_property = "o_data"
        this.o_data = null
    }

    f_get_object_and_property_by_dot_notation(o_object, s_dotnotation){
        var o_object_original = o_object
        // s_dotnotation my_object.some_obj.position.z => object => my_object.some_obj.position, property z
        var a_parts = s_dotnotation.split(".");
        while(a_parts.length>1){
            if(a_parts.length == 2){
                var o_object_parent = o_object
                var s_prop_parent = a_parts[0]
            }
            o_object = o_object[a_parts.shift()]
        }

        var o_return  ={
            o_object: {
                o_object: o_object, 
                s_prop: a_parts.join("."), 
            }, 
            o_object_parent:{
                o_object: o_object_parent,
                s_prop: s_prop_parent

            }
        }

        // if(!o_return.o_object.o_object || !o_return.o_object_parent.o_object){
        //     console.error(`property ${s_dotnotation} does not exist in object ${o_object_original}`)
        // }

        return o_return
    }

    f_recursive_convert_object_to_html_element(object,  o_data = null){
        


        var s_tag_name = object[this.s_prop_name_tag_name]
        s_tag_name = (s_tag_name) ? s_tag_name : this.s_default_tag_name

        var o_html_element = document.createElement(s_tag_name)

        for(var s_prop_name in object){

            var value = object[s_prop_name]

            // console.log(
            //     s_prop_name, 
            //     value
            // )
            // handle linking 
            var a_o_string_endings = [
                { "s_ending": this.s_link_property_suffix, "b_endsWith":s_prop_name.endsWith(this.s_link_property_suffix)},
                { "s_ending": "<o>", "b_endsWith":s_prop_name.endsWith("<o>")}
            ]
            var o_string_ending = a_o_string_endings.filter(o=>o.b_endsWith)[0]

            if(
                o_string_ending
            ){ 
                var s_prop_name_o_html_element = s_prop_name.substring(0, (s_prop_name.length - o_string_ending.s_ending.length))
                var s_prop_name_o_data_for_linking = value

                // s_prop_name_o_data_for_linking could be a property in dotnotation 
                // which points to a nested object, for example 'color.rgba.r'
                // so we have to get the parent object 'color.rgba' and the propname 'r'
                var o_resolved_dotnotation = this.f_get_object_and_property_by_dot_notation(
                    o_data, 
                    this.s_default_o_data_first_property + "." + s_prop_name_o_data_for_linking
                );
                
                if(!o_resolved_dotnotation.o_object.o_object || !o_resolved_dotnotation.o_object_parent.o_object){
                    console.error(`property ${s_prop_name_o_data_for_linking} does not exist in object ${o_data}`)
                }

                var o_data_resolved = o_resolved_dotnotation.o_object.o_object
                var o_data_resolved_parent = o_resolved_dotnotation.o_object_parent.o_object
                var s_prop_o_data_resolved = o_resolved_dotnotation.o_object.s_prop
                var s_prop_o_data_resolved_parent = o_resolved_dotnotation.o_object_parent.s_prop
                // debugger
                // if(o_string_ending.s_ending == "<>"){
                //     // console.log(
                //     //     o_data_resolved, 
                //     //     s_prop_o_data_resolved,
                //     //     o_html_element, 
                //     //     s_prop_name_o_html_element,
                //     // )
                //     var a_objs = f_a_link_object_properties(
                //         // the order is important!
                //         o_data_resolved, 
                //         s_prop_o_data_resolved,
                //         o_html_element, 
                //         s_prop_name_o_html_element,
                //     )

                //     //the data object must be a Proxy
                //     // since we cannot change the reference by the param variable 
                //     // o_data_resolved = a_objs[0] // a_objs[0] is a proxy!
                //     // o_data_resolved_parent[s_prop_o_data_resolved_parent] = a_objs[0]
                //     o_data_resolved_parent[s_prop_o_data_resolved_parent] = o_data_resolved_parent[s_prop_o_data_resolved_parent].o_proxy
  
                // }
                
                if(o_string_ending.s_ending == "<o>"){
                    //link objects aka use reference
                    o_data[this.s_default_o_data_first_property + "." + s_prop_name_o_data_for_linking] = o_html_element[s_prop_name_o_html_element]
                    // for linking a html style object to a data object
                    // o_html_element[s_prop_name_o_html_element] = o_data_for_linking[s_prop_name_o_data_for_linking]
                }
                // inputs on input elements wont trigger setter function 
                if(
                    object[this.s_prop_name_tag_name]
                ){
                    if(object[this.s_prop_name_tag_name] == "input"){
                        o_html_element.addEventListener("input", function(){
                            // console.log(this.value)
                            window.o_element = this
                            this.value = this.value // trigger setter
                        })
                    }
                }
    
            }

            // handle functions
            if(typeof value === "function"){
                // o_html_element.addEventListener(
                //   s_prop_name.substring(2),
                //   value
                // )
                // o_html_element.onclick = function(){
                //   "clicked"
                // }
              
                // // value.apply
                // if(o_string_ending?.s_ending == "<>"){
                //     object[s_prop_name] = value.apply(o_data_parent[s_o_data_parent])
                // }
                // //excluding onclick, onmousemove etc.
                // if(s_prop_name.indexOf("on") == -1){
                //     object[s_prop_name] = value.apply(object)
                // }
                // debugger;
                o_html_element[s_prop_name] = value
                // debugger
            }

            //handle static properties
            if(
                s_prop_name != this.s_prop_name_tag_name &&
                s_prop_name != this.s_prop_name_children_elements &&
                s_prop_name != this.s_default_tag_name &&
                s_prop_name != this.s_prop_name_inner_html &&
                s_prop_name != this.s_prop_name_inner_text &&
                !o_string_ending
                ){

                if(typeof value === "function"){
                    var self = this
                    //onclick , onmousemove, onwheel, etc functions
                    // // console.log(value)
                    // var f_value = value 
                    // o_html_element.addEventListener(s_prop_name.substring(2), function(event){
                    //     f_value.apply(self.o_data, [event])
                    // })
                    
                    // o_html_element[s_prop_name] = value
                }else{
                    // console.log(s_prop_name)
                    // console.log(value)
                    o_html_element.setAttribute(s_prop_name, value)
                }

            }


        }
        // // we have to add a proxy
        // f_add_property_o_proxy(o_data); 

        // handle childre
        var a_o_child_object = object[this.s_prop_name_children_elements]
        if(a_o_child_object){
            for(var n_index_a_o_child_object in a_o_child_object){
                var o_child = a_o_child_object[n_index_a_o_child_object]    
                if(
                    Array.isArray(o_child) == false &&
                    typeof o_child === "object"
                    ){
                      if(o_child.hasOwnProperty("b_jth_render")){
                        if(o_child.b_jth_render !== true){
                          continue
                        }
                      }
                    var o_child_html_element = this.f_recursive_convert_object_to_html_element(o_child, o_data)
                    o_html_element.appendChild(o_child_html_element)
                }
            }
        }

        // handle innerText innerHTML
        var s_inner_text = object[this.s_prop_name_inner_text]
        if(s_inner_text){
            o_html_element.innerText = s_inner_text
        }
        var s_inner_html = object[this.s_prop_name_inner_html]
        if(s_inner_html){
            o_html_element.innerHTML = s_inner_html
        }



        return o_html_element
    }
    f_recursive_convert_html_element_to_object(o_html_element){
                
        var obj = {};

        obj[this.s_default_tag_name] = o_html_element.tagName.toLowerCase();

        for (var n_i = 0, a_attributes = o_html_element.attributes; n_i < a_attributes.length; n_i++){
            obj[a_attributes[n_i].nodeName] = a_attributes[n_i].nodeValue;
        }

        var a_o_child_object = [];

        var child_elements = o_html_element.children; 

        for(var key = 0; key < child_elements.length; key++){
          var child_element = child_elements[key];

          var o_child_object = this.f_recursive_convert_html_element_to_object(child_element)
          a_o_child_object.push(o_child_object);
        }

        if(a_o_child_object.length >0){
          obj[this.s_prop_name_children_elements] = a_o_child_object;
        }else{
          if(o_html_element.innerText != ""){
            obj[this.s_prop_name_inner_text] = o_html_element.innerText;
          }
        }
      
        return obj;
    }

    f_json_or_jsobject_to_html(value, o_data = null){
        this.o_data = o_data
        return this.f_recursive_convert_object_to_html_element(
            this.f_convert_string_to_javascript_object(value),
            this.f_prepend_dotnotaion_to_o_data(o_data)
        )
        
    }
    f_json_to_html(value,  o_data = null){
        return this.f_json_or_jsobject_to_html(value, o_data)
    }
    f_javascript_object_to_html(value,  o_data = null){ 
        return this.f_json_or_jsobject_to_html(value, o_data)
    }
    f_prepend_dotnotaion_to_o_data(o_data = null){
        //o_data
        var object = {}
        object[this.s_default_o_data_first_property] = o_data
        return object
    }
    f_convert_string_to_javascript_object(value){
        // if not yet an object, convert to one
        if(typeof value === "string"){
            value = JSON.parse(value)
        }
        return value
    }
    f_html_to_object(o_html_element){
        return this.f_recursive_convert_html_element_to_object(o_html_element)
    }
    f_html_to_json(o_html_element){
        return JSON.stringify(this.f_html_to_object(o_html_element))
    }
    //aliases 
    parse(){
        return this.f_json_to_html()
    }
}
