var NutriNinja = {};

NutriNinja.ailments = [
		{
			id : "a1",
			value : "Hypertension",
			label : "Hypertension",
			nutrientsNeeded : [],
			nutrientsToAvoid : ["n4"]
		},
		{
			id : "a2",
			value : "Arthritis",
			label : "Arthritis",
			nutrientsNeeded : ["n2"],
			nutrientsToAvoid : []	
		}
];

NutriNinja.nutrients = [
		{
			id : "n1",
			value : "Protein",
			label : "Protein",
			categoriesMap : {
				high : ["c1", "c2", "c3"],
				low : ["c4"],
				zero : ["c5"]
			}

		},
		{
			id : "n2",
			value : "Calcium",
			label : "Calcium",
			categoriesMap : {
				high : ["c1", "c4"],
				low : ["c2"],
				zero : ["c3", "c5"]
			}
		},
		{
			id : "n3",
			value : "Vitamin-C",
			label : "Vitamin-C",
			categoriesMap : {
				high : ["c5"],
				low : ["c1"],
				zero : ["c2", "c3", "c4"]
			}
		},
		{
			id : "n4",
			value : "Unsaturated Fat",
			label : "Unsaturated Fat",
			categoriesMap : {
				high : ["c3", "c4"],
				low : ["c1", "c2"],
				zero : ["c5"]
			}
		},
		{
			id : "n5",
			value : "Omega-3",
			label : "Omega-3",
			categoriesMap : {
				high : ["c3"],
				low : ["c1", "c2", "c4"],
				zero : ["c5"]
			}
		}
];

NutriNinja.categories = [
		{
			id : "c1",
			value : "Milk",
			label : "Milk"
		},
		{
			id : "c2",
			value : "Eggs",
			label : "Eggs"
		},
		{
			id : "c3",
			value : "Fish",
			label : "Fish"
		},
		{
			id : "c4",
			value : "Almonds",
			label : "Almonds"
		},
		{
			id : "c5",
			value : "Oranges",
			label : "Oranges"
		}
];



NutriNinja.getNutrient = function(id){
	for(var i = 0; i < this.nutrients.length; i++){
		if(this.nutrients[i].id === id){
			return this.nutrients[i];
		}
	}
};

NutriNinja.getCategory = function(id){
	for(var i = 0; i < this.categories.length; i++){
		if(this.categories[i].id === id){
			return this.categories[i];
		}
	}
};



/* ------------------------- Other Ailments and Nutrients ------------------------- */
var _ailments = [
      "Achondroplasia", "Acne", "AIDS", "Beriberi", "Calculi", "Chalazion", "Cancer", "Cerebral palsy", "Chagas disease", "Ebola", "Emphysema", "Gangrene", "Gonorrhea",
      "Jaundice", "Leprosy", "Listeriosis", "Mumps", "Myelitis", "Myxedema", "Hypothyroid", "Rubella","Sepsis"];

var _nutrients = ["Protein", "Simple Carbohydrate", "Complex Carbohydrate", "Protein", "Salt", "Vitamin-A", "Vitamin-C", "Vitamin-D", "Vitamin-E", "Vitamin-K"];