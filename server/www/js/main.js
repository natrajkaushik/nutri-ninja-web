  $(function() {

    /* ------------------------- Initialization ------------------------- */
    
    //Obtain ailment, nutrition and category data from datasources
    var ailments = NutriNinja.ailments;
    var nutrients = NutriNinja.nutrients;
    var categories = NutriNinja.categories;
    
    var selectedAilments = []; //keeps track of currently selected ailments
    var selectedNutrients = []; // keeps track of currently selected nutrients
    var selectedCategories = []; // keeps track of currently selected categories
    var selectedGroceries = []; // keeps track of currently selected grocery list
    var nutrientInFocus; // Nutrient for which category recommendations are currently present in the category widget


    //$( ".sortable" ).sortable(); //make all the li's sortable
    //$( ".sortable" ).disableSelection();
    $(".draggable").draggable(); // make the widgets draggable

    /* ------------------------- Ailments Widget ------------------------- */
    $("#ailments").autocomplete({
      source: ailments,
      select : function(event, ui){
        if(!(_.contains(selectedAilments, ui.item.id))){
          $("#ailments-list").append("<li id=" + ui.item.id + " class=\"ui-state-default\">" + ui.item.label + "</li>");
          selectedAilments.push(ui.item.id);

          var nutrientInfo = {add : ui.item.nutrientsNeeded, avoid : ui.item.nutrientsToAvoid};
          addNutrients(nutrientInfo);
          $("#ailments").val("");
        }
      return false;
      
      }
    });

    
    /* ------------------------- Nutrients Widget ------------------------- */
    var lights_img_html = "<img id=\"green-light\" class=\"traffic-light\" src=\"img/green_n.png\"></img>" + "<img id=\"orange-light\" class=\"traffic-light\" src=\"img/yellow_n.png\"></img>" 
              + "<img id=\"red-light\" class=\"traffic-light\" src=\"img/red_n.png\"></img>";

    var green_tick_html = "<img class=\"selection-feedback\" src=\"img/yes.png\"/>";
    var light_green_tick_html = "<img class=\"selection-feedback\" src=\"img/maybe.png\"/>";
    var red_cross_html = "<img class=\"selection-feedback\" src=\"img/no.png\"/>";

    $("#nutrients").autocomplete({
      source: nutrients,
      select : function(event, ui){
        if(!(_.contains(selectedNutrients, ui.item.id))){
          $("#nutrients-list").append(green_tick_html + "<li id=" + ui.item.id + " style=\"background:#CCFF99\" class=\"ui-state-default nutrient-add\">" 
                        + ui.item.label + lights_img_html + "</li>");
          selectedNutrients.push(ui.item.id);
          setFocusOnNutrient(ui.item.id);
          addCategories(ui.item.id);
          $("#nutrients").val("");
        }
        return false;
      }
    });

    /**
     * nutrientInfo : {add : [] , avoid : []}
     * adds the nutrients present in add list in green and those to avoid in red to the nutrient list
     */
    function addNutrients(nutrientInfo){
      var add = nutrientInfo.add;
      if(add && add.length > 0){
        for(var i = 0; i < add.length; i++){
          var nutrient = NutriNinja.getNutrient(add[i]);
          if(!(_.contains(selectedNutrients, nutrient.id))){
            $("#nutrients-list").append(green_tick_html + "<li id=" + nutrient.id + " style=\"background:#CCFF99\" class=\"ui-state-default nutrient-add\">" 
                        + nutrient.label + lights_img_html + "</li>");
            selectedNutrients.push(nutrient.id);
            addCategories(nutrient.id);
            setFocusOnNutrient(nutrient.id);
          }
        }
      }

      var avoid = nutrientInfo.avoid;
      if(avoid && avoid.length > 0){
        for(var i = 0; i < avoid.length; i++){
          var nutrient = NutriNinja.getNutrient(avoid[i]);
          if(!(_.contains(selectedNutrients, nutrient.id))){
            $("#nutrients-list").append(red_cross_html + "<li id=" + nutrient.id + " style=\"background:#FF8566\" class=\"ui-state-default nutrient-avoid\">" 
                        + nutrient.label + lights_img_html + "</li>");
            selectedNutrients.push(nutrient.id);
            setFocusOnNutrient(nutrient.id);
          }
        }
      }
    }

    /**
     * dynamic binding of on click events to the selector lights 
     */
    $(document).on(
      "click", ".traffic-light", function(event){
          var id = $(this).attr("id");
          var parent = $(this).parent();
          //var selectionFeedbackImage = $()
          switch (id){
            case "green-light":
              parent.css("background", "#CCFF99");
              parent.removeClass("nutrient-avoid");
              parent.removeClass("nutrient-less");
              parent.addClass("nutrient-add");
              parent.prev().remove();
              parent.before(green_tick_html);
              break;
            case "orange-light":
              parent.css("background", "#FFD699");
              parent.removeClass("nutrient-avoid");
              parent.addClass("nutrient-less");
              parent.removeClass("nutrient-add");
              parent.prev().remove();
              parent.before(light_green_tick_html);
              break;
            case "red-light":
              parent.css("background", "#FF8566");
              parent.addClass("nutrient-avoid");
              parent.removeClass("nutrient-less");
              parent.removeClass("nutrient-add");
              parent.prev().remove();
              parent.before(red_cross_html);
              break;
            default:  
              parent.css("background", "#CCFF99");
              parent.removeClass("nutrient-avoid");
              parent.removeClass("nutrient-less");
              parent.addClass("nutrient-add");
              parent.prev().remove();
              parent.before(green_tick_html);
              break;
          }
          setFocusOnNutrient(parent.attr("id"));
          addCategories(parent.attr("id"));
          //populateCategories();
          event.stopPropagation();   
        }
     );

    /** 
     * nutrientId : nutrient id of nutrient row to focus
     */
    function setFocusOnNutrient(nutrientId){
      var oldRow = $("#" + nutrientInFocus);
      oldRow.removeClass("selected");
      oldRow.css("border", "1px solid #D3D3D3");
      $("#categories-widget").css("border", "1px dashed #333");

      var row = $("#" + nutrientId);
      row.addClass("selected");
      row.css("border", "2px solid #4D4D94");
      $("#categories-widget").css("border", "2px solid #4D4D94");

      nutrientInFocus = nutrientId;
    }

    /**
     * dynamic binding of click event on nutrient selector 
     */
    $(document).on("click", "#nutrients-list li", function(event){
      var nutrientId = $(this).attr("id");
      setFocusOnNutrient(nutrientId);
      addCategories(nutrientId);
    });

    /**
     * selects and adds the categories for a particular nutrientId
     */
    function addCategories(nutrientId){
      var nutrientRow = $("#" + nutrientId);
      
      clearCategoryWidget();
      var categoriesToAvoid = getCategoriesToAvoid();
      // if nutrient is not to be avoided
      if(!nutrientRow.hasClass("nutrient-avoid")){
        var nutrient = NutriNinja.getNutrient(nutrientRow.attr("id"));

        // add a row for each category in category widget
        var categoriesToAdd = nutrientRow.hasClass("nutrient-add") ? nutrient.categoriesMap.high : nutrient.categoriesMap.less; 
        categoriesToAdd = _.difference(categoriesToAdd, categoriesToAvoid);
        
        for(var i = 0; i < categoriesToAdd.length; i++){
          addCategoryRow(categoriesToAdd[i]);  
        }
      }  
    }

    /* ------------------------- Categories Widget ------------------------- */

    /**
     * adds an category entry corresponding to categoryId in Category Widget
     */
    function addCategoryRow(categoryId){
      if(!_.contains(selectedCategories, categoryId)){
        var category = NutriNinja.getCategory(categoryId);
        var row = "<li id=" + categoryId + " style=\"background:#FFFFFF\" class=\"ui-state-default category-row\">" + category.label 
                  + "<img src=\"img/add.png\" class=\"add-category\">" + "</li>";
        $("#categories-list").append(row);
        selectedCategories.push(categoryId);  
      }
    }

    /** 
     * clears the category widget
     */
    function clearCategoryWidget(){
      $("#categories-list .category-row").remove();
      selectedCategories = []; 
    }

    /**
     * returns the list of categories to be avoided (based on the nutrients that are to be avoided)
     */
    function getCategoriesToAvoid(){
      var categoriesToAvoid = [];

      var avoidRows = $("#nutrients-widget .nutrient-avoid");
      for(var i = 0; i < avoidRows.length; i++){
        var nutrientId = $(avoidRows[i]).attr("id");
        var nutrient = NutriNinja.getNutrient(nutrientId);

        var avoid = _.union(nutrient.categoriesMap.high, nutrient.categoriesMap.low);
        categoriesToAvoid = _.union(categoriesToAvoid, avoid);
      }

      return categoriesToAvoid;
    }

    /**
     * populates categories based on current status of nutrients widget
     */
    function populateCategories(){
      clearCategoryWidget();
      var categoriesToAvoid = getCategoriesToAvoid();
      var add = $("#nutrients-widget .nutrient-add");
      var less = $("#nutrients-widget .nutrient-less");
      var nutrientId, nutrient;
      var categorySet = [];

      for(var i = 0; i < add.length; i++){
        nutrientId = $(add[i]).attr("id");
        nutrient = NutriNinja.getNutrient(nutrientId);
        categorySet = categorySet.concat(nutrient.categoriesMap.high);
      }

      for(var i = 0; i < less.length; i++){
        nutrientId = $(add[i]).attr("id");
        nutrient = NutriNinja.getNutrient(nutrientId);
        categorySet = categorySet.concat(nutrient.categoriesMap.low);
      }

      categorySet = _.uniq(_.difference(categorySet, categoriesToAvoid));
      _.each(categorySet, addCategoryRow);
    }

    $(document).on("click", "#categories-list .category-row", function(event){
      var categoryId = $(this).attr("id");
      if(!_.contains(selectedGroceries, categoryId)){
        var category = NutriNinja.getCategory(categoryId);
        var row = "<li id=" + "G" + categoryId + " nid=" + categoryId + " style=\"background:#FFFFFF\" class=\"ui-state-default grocery-row\">" + category.label 
                  + "</li>";
        $("#grocery-list").append(row);
        selectedGroceries.push(categoryId);  
      }  
    });

    function clearGroceryList(){
      $("#grocery-list .grocery-row").remove();
      selectedGroceries = []; 
    }

    function updateGroceryList(){
      var categoryIds = $("#grocery-list .grocery-row").attr("nid");
      clearGroceryList();
    }

  });

