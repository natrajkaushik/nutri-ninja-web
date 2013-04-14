  $(function() {
    var ailments = [
      "Achondroplasia", "Acne", "AIDS", "Beriberi", "Calculi", "Chalazion", "Cancer", "Cerebral palsy", "Chagas disease", "Ebola", "Emphysema", "Gangrene", "Gonorrhea",
      "Jaundice", "Leprosy", "Listeriosis", "Mumps", "Myelitis", "Myxedema", "Hypothyroid", "Rubella","Sepsis"];

    var nutrients = ["Protein", "Simple Carbohydrate", "Complex Carbohydrate", "Protein", "Salt", "Vitamin-A", "Vitamin-C", "Vitamin-D", "Vitamin-E", "Vitamin-K"];
    
    $( ".sortable" ).sortable(); //make all the li's sortable
    $( ".sortable" ).disableSelection();
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

    $("#nutrients").autocomplete({
      source: nutrients,
      select : function(event, ui){
        $("#nutrients-list").append("<li style=\"background:#CCFF99\" class=\"ui-state-default\">" + ui.item.label + lights_img_html + "</li>");
        $("#nutrients").val("");
        return false;
      }
    });

    /* dynamic binding of on click events to the selector lights */
    $(document).on(
      "click", ".traffic-light", function(event){
          var id = $(this).attr("id");
          switch (id){
            case "green-light":
              $(this).parent().css("background", "#CCFF99");
              break;
            case "orange-light":
              $(this).parent().css("background", "#FFD699");
              break;
            case "red-light":
              $(this).parent().css("background", "#FF8566");
              break;
            default:  
              $(this).parent().css("background", "#CCFF99");
              break;
          }   
        }
     );

  });

