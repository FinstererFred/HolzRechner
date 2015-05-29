/* stammdaten */
var staerkeKlassen = 
{
	0: {'name': '0',  'von' :0 , 'bis': 9 },
	1: {'name': '1a', 'von' :10, 'bis': 14},
	2: {'name': '1b', 'von' :15, 'bis': 19},
	3: {'name': '2a', 'von' :20, 'bis': 24},
	4: {'name': '2b', 'von' :25, 'bis': 29},
	5: {'name': '3a', 'von' :30, 'bis': 34},
	6: {'name': '3b', 'von' :35, 'bis': 39},
	7: {'name': '4',  'von' :40, 'bis': 49},
	8: {'name': '5',  'von' :50, 'bis': 59},
	9: {'name': '6',  'von' :60, 'bis': 69},
	10: {'name': '7', 'von' :70, 'bis': 79},
	11: {'name': '8', 'von' :80, 'bis': 89}
}

var rindenAbzug = 
{
	0 : { 
		0: { 'von': 0, 'bis': 4, 'abzug': 1},
		1: { 'von': 5, 'bis': 8, 'abzug': 2},
		2: { 'von': 9, 'bis': 100, 'abzug': 3}
	},

	1 : { 
		0: { 'von': 0, 'bis': 2, 'abzug': 1},
		1: { 'von': 3, 'bis': 5, 'abzug': 2},
		2: { 'von': 6, 'bis': 8, 'abzug': 3},
		3: { 'von': 9, 'bis':100, 'abzug': 4}
		
	},

	2 : { 
		0: { 'von': 0, 'bis': 6, 'abzug': 1},
		1: { 'von': 7, 'bis': 100, 'abzug': 2}		
	},

	3 : { 
		0: { 'von': 0, 'bis': 3, 'abzug': 1},
		1: { 'von': 4, 'bis': 4, 'abzug': 2},
		2: { 'von': 5, 'bis': 6, 'abzug': 3},
		3: { 'von': 7, 'bis': 7, 'abzug': 4},
		4: { 'von': 8, 'bis': 100, 'abzug': 5}
	}
}

var baeume = 
{
	0 : {'name': 'Fichte', 		'abzug': 0},
	1 : {'name': 'Kiefer',		'abzug': 1},
	2 : {'name': 'Tanne',		'abzug': 0},
	3 : {'name': 'Douglasie',	'abzug': 1},
	4 : {'name': 'Eiche',		'abzug': 3},
	5 : {'name': 'Buche',		'abzug': 2},
	6 : {'name': 'Birke',		'abzug': 2},
	7 : {'name': 'Lärche',		'abzug': 1},
	8 : {'name': 'Sonstiger',	'abzug': 0}
}