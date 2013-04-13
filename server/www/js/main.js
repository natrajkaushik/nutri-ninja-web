  $(function() {
    var ailments = [
      "Achondroplasia",
      "Acne",
      "AIDS",
      "Beriberi",
      "Calculi",
      "Chalazion",
      "Cancer",
      "Cerebral palsy",
      "Chagas disease",
      "Ebola",
      "Emphysema",
      "Gangrene",
      "Gonorrhea",
      "Jaundice",
      "Leprosy",
      "Listeriosis",
      "Mumps",
      "Myelitis",
      "Myxedema",
      "Hypothyroid",
      "Rubella",
      "Sepsis"
    ];
    
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();

    $("#ailments").autocomplete({
      source: ailments,
      select : function(event, ui){
        $("#sortable").append("<li class=\"ui-state-default\">" + ui.item.label + "</li>");
        $("#ailments").val("");
        return false;
      }
    });

    $( "#draggable" ).draggable();

  });

