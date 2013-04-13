  $(function() {
    var ailments = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
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

