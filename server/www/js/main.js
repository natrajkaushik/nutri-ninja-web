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

    $(".draggable").draggable(); // make the widgets draggable

    //initialize user details
    var sampleUserDetails = "Name: Gery Oldman &nbsp&nbsp&nbsp&nbsp Age: 72 &nbsp&nbsp&nbsp&nbsp Gender: Male &nbsp&nbsp&nbsp&nbsp City: Atlanta, GA";
    $(".personal-details span").html(sampleUserDetails);

    var closeButtonHTML = "<img class=\"remove-button\" src=\"img/close.jpg\"/>";

    // on clicking remove button
    $(document).on("click", ".remove-button", function(event){
      var listId = $(this).parent().attr("id");
      var id = $(this).prev().attr("id");
      var index;
      var selectedContainer;

      switch (listId){
        case "ailments-list":
          selectedContainer = selectedAilments;
          break;
        case "nutrients-list":
          selectedContainer = selectedNutrients;
          $(this).prev().prev().remove();
          break;
        case "categories-list":
          selectedContainer = selectedCategories;
          break;
        case "grocery-list":
          selectedContainer = selectedGroceries;
          id = $(this).prev().attr("categoryId");
          break;
      }

      index = selectedContainer.indexOf(id);
      selectedContainer.splice(index, 1);

      $(this).prev().remove();
      $(this).remove();

    })

    /* ------------------------- Ailments Widget ------------------------- */
    $("#ailments").autocomplete({
      source: ailments,
      select : function(event, ui){
        if(!(_.contains(selectedAilments, ui.item.id))){
          $("#ailments-list").append("<li id=" + ui.item.id + " class=\"ui-state-default ailment-row\">" + 
                    ui.item.label + "</li>" + closeButtonHTML);
          selectedAilments.push(ui.item.id);

          var nutrientInfo = {add : ui.item.nutrientsNeeded, avoid : ui.item.nutrientsToAvoid};
          addNutrients(nutrientInfo);
          $("#ailments").val("");
        }
      return false;
      
      }
    });

    
    /* ------------------------- Nutrients Widget ------------------------- */
    var lightsImgHTML = "<img id=\"green-light\" class=\"traffic-light\" src=\"img/green_n.png\"></img>" + "<img id=\"orange-light\" class=\"traffic-light\" src=\"img/yellow_n.png\"></img>" 
              + "<img id=\"red-light\" class=\"traffic-light\" src=\"img/red_n.png\"></img>";

    var greenTickHTML = "<img class=\"selection-feedback\" src=\"img/yes.png\"/>";
    var lightGreenTickHTML = "<img class=\"selection-feedback\" src=\"img/maybe.png\"/>";
    var redCrossHTML = "<img class=\"selection-feedback\" src=\"img/no.png\"/>";

    $("#nutrients").autocomplete({
      source: nutrients,
      select : function(event, ui){
        if(!(_.contains(selectedNutrients, ui.item.id))){
          $("#nutrients-list").append(greenTickHTML + "<li id=" + ui.item.id + " style=\"background:#CCFF99\" class=\"ui-state-default nutrient-add nutrient-row\">" 
                        + ui.item.label + lightsImgHTML + "</li>" + closeButtonHTML);
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
            $("#nutrients-list").append(greenTickHTML + "<li id=" + nutrient.id + " style=\"background:#CCFF99\" class=\"ui-state-default nutrient-add nutrient-row\">" 
                        + nutrient.label + lightsImgHTML + "</li>" + closeButtonHTML);
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
            $("#nutrients-list").append(redCrossHTML + "<li id=" + nutrient.id + " style=\"background:#FF8566\" class=\"ui-state-default nutrient-avoid nutrient-row\">" 
                        + nutrient.label + lightsImgHTML + "</li>" + closeButtonHTML);
            selectedNutrients.push(nutrient.id); 
          }
          else{
            var row = $("#" + nutrient.id);
            row.css("background", "#FF8566");
            row.addClass("nutrient-avoid");
            row.removeClass("nutrient-less");
            row.removeClass("nutrient-add");
            row.prev().remove();
            row.before(redCrossHTML);
          }
          setFocusOnNutrient(nutrient.id);
          clearCategoryWidget();
          updateGroceryList();
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
              parent.before(greenTickHTML);
              break;
            case "orange-light":
              parent.css("background", "#FFD699");
              parent.removeClass("nutrient-avoid");
              parent.addClass("nutrient-less");
              parent.removeClass("nutrient-add");
              parent.prev().remove();
              parent.before(lightGreenTickHTML);
              break;
            case "red-light":
              parent.css("background", "#FF8566");
              parent.addClass("nutrient-avoid");
              parent.removeClass("nutrient-less");
              parent.removeClass("nutrient-add");
              parent.prev().remove();
              parent.before(redCrossHTML);
              break;
            default:  
              parent.css("background", "#CCFF99");
              parent.removeClass("nutrient-avoid");
              parent.removeClass("nutrient-less");
              parent.addClass("nutrient-add");
              parent.prev().remove();
              parent.before(greenTickHTML);
              break;
          }
          setFocusOnNutrient(parent.attr("id"));
          addCategories(parent.attr("id"));
          updateGroceryList();
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
                  + "<img src=\"img/add.png\" class=\"add-category\">" + "</li>" + closeButtonHTML;
        $("#categories-list").append(row);
        selectedCategories.push(categoryId);  
      }
    }

    /** 
     * clears the category widget
     */
    function clearCategoryWidget(){
      $("#categories-list .category-row").remove();
      $("#categories-list .remove-button").remove();
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

    /**
     * on click event handler on category row to add it to the grocery list
     */
    $(document).on("click", "#categories-list .add-category", function(event){
      var categoryId = $(this).parent().attr("id");
      if(!_.contains(selectedGroceries, categoryId)){
        var category = NutriNinja.getCategory(categoryId);
        var row = "<li id=" + "G" + categoryId + " categoryId=" + categoryId + " style=\"background:#FFFFFF\" class=\"ui-state-default grocery-row\">" + category.label 
                  + "</li>" + closeButtonHTML;
        $("#grocery-list").append(row);
        selectedGroceries.push(categoryId);  
      }  
    });

    /* ------------------------- Grocery List Widget ------------------------- */

    /**
     * clear the grocery list
     */
    function clearGroceryList(){
      $("#grocery-list .grocery-row").remove();
      $("#grocery-list .remove-button").remove();
      selectedGroceries = []; 
    }

    /**
     * update the grocery list
     */
    function updateGroceryList(){
      var categoriesToAvoid = getCategoriesToAvoid();
      var groceryListItems = $("#grocery-list .grocery-row");
      
      groceryListItems.each(function(index){
        var categoryId = $(this).attr("categoryId");
        if(_.contains(categoriesToAvoid, categoryId)){
          var index = selectedGroceries.indexOf(categoryId);
          selectedGroceries.splice(index, 1);
          $(this).next().remove();
          $(this).remove();
        }
      });
    }

    /**
     * creates the printable grocery list dialog with categoriy entries from the set [categoryIds]
     */
    function createPrintableGroceryListDialog(categoryIds){
      var html = "<div id=\"print-grocery-list\">";
      _.each(categoryIds, processCategory);

      function processCategory(categoryId){
        var category = NutriNinja.getCategory(categoryId);
        html += "<span class=\"print-category\">"  + category.label + ": " + "Aisle " + category.aisle + "</span><br>";
        var brands = category.brands;
        for(var i = 0; i < brands.length; i++){
          html+= "&nbsp&nbsp&nbsp&nbsp.....&nbsp" + "<span class=\"print-brand\">"  + brands[i] + "</span><br>";  
        }
        html += "<br><br>"
      }

      html+= "</div>";
      $("#dialog").html(html);
    }


    /**
     * on click handler for the print button on grocery list
     */
    $("button.print-grocery-list").click(function(event){
      var categoryIds = [];

      // get the category Ids of the categories in the grocery list
      $("#grocery-list .grocery-row").each(function(index){
        categoryIds.push($(this).attr("categoryId"));
      });
      
      createPrintableGroceryListDialog(categoryIds);
      $("#dialog").dialog("open");
    });



    /* ------------------------- Print Dialog ------------------------- */
     // creating the print dialog
     $("#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 300
      },
      height: 800,
      width: 600

    });

  });

