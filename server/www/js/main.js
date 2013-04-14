  $(function() {
    var ailments = [
      "Achondroplasia", "Acne", "AIDS", "Beriberi", "Calculi", "Chalazion", "Cancer", "Cerebral palsy", "Chagas disease", "Ebola", "Emphysema", "Gangrene", "Gonorrhea",
      "Jaundice", "Leprosy", "Listeriosis", "Mumps", "Myelitis", "Myxedema", "Hypothyroid", "Rubella","Sepsis"];

    var nutrients = ["Protein", "Simple Carbohydrate", "Complex Carbohydrate", "Protein", "Salt", "Vitamin-A", "Vitamin-C", "Vitamin-D", "Vitamin-E", "Vitamin-K"];
    
    //$( ".sortable" ).sortable(); //make all the li's sortable
    //$( ".sortable" ).disableSelection();
    $( ".draggable" ).draggable(); // make the widgets draggable

    /* ------------------------- Ailments Widget ------------------------- */
    $("#ailments").autocomplete({
      source: ailments,
      select : function(event, ui){
        $("#ailments-list").append("<li class=\"ui-state-default\">" + ui.item.label + "</li>");
        $("#ailments").val("");
        return false;
      }
    });

    
    /* ------------------------- Nutrients Widget ------------------------- */
    var lights_img_html = "<img id=\"green-light\" class=\"traffic-light\" src=\"/img/green.png\"></img>" + "<img id=\"orange-light\" class=\"traffic-light\" src=\"/img/orange.png\"></img>" 
              + "<img id=\"red-light\" class=\"traffic-light\" src=\"/img/red.png\"></img>";

    var green_tick_html = "<img class=\"selection-feedback\" src=\"/img/green_tick.png\"/>";
    var light_green_tick_html = "<img class=\"selection-feedback\" src=\"/img/light_green_tick.png\"/>";
    var red_cross_html = "<img class=\"selection-feedback\" src=\"/img/red_cross.png\"/>";

    $("#nutrients").autocomplete({
      source: nutrients,
      select : function(event, ui){
        $("#nutrients-list").append(green_tick_html + "<li style=\"background:#CCFF99\" class=\"ui-state-default\">" 
                      + ui.item.label + lights_img_html + "</li>");
        $("#nutrients").val("");
        return false;
      }
    });

    /* dynamic binding of on click events to the selector lights */
    $(document).on(
      "click", ".traffic-light", function(event){
          var id = $(this).attr("id");
          var parent = $(this).parent();
          switch (id){
            case "green-light":
              parent.css("background", "#CCFF99");
              parent.before(green_tick_html);
              break;
            case "orange-light":
              parent.css("background", "#FFD699");
              parent.before(light_green_tick_html);
              break;
            case "red-light":
              parent.css("background", "#FF8566");
              parent.before(red_cross_html);
              break;
            default:  
              parent.css("background", "#CCFF99");
              parent.before(green_tick_html);
              break;
          }   
        }
     );

    /* dynamic binding of click event on nutrient selector */
    $(document).on("click", "#nutrients-list li", function(event){
      //$(this).addClass("selected");
      $(this).css("border", "2px solid #4D4D94");
      $("#categories-widget").css("border", "2px solid #4D4D94");
      addCategoryRow("Milk");
    });

    /* ------------------------- Categories Widget ------------------------- */

    function addCategoryRow(category){
      var row = "<li style=\"background:#FFFFFF\" class=\"ui-state-default category-row\">" + category + "<img src=\"/img/add.png\" class=\"add-category\">" + "</li>";
      $("#categories-list").append(row);
    }

  });

