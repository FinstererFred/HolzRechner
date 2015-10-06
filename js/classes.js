function Hieb(newH) 
{
    /* eigenschaften von hieb */
	    this.staemme = [];
 		this.valid = true;
 		this.name = '';
 		this.bestand = '';
 		this.datum = '';

	/* constructor, wird von tab staemme aufgerufen */	 		
 		if(newH)
 		{
 			this.init();
 		}

}

	Hieb.prototype = 
	{
	    init: function()
	    {
	    	this.name  = $('#inputName').val();
	    	this.bestand = $('#inputBestand').val();
	    	this.datum = $('#inputDatum').val();
	    },

	    addStamm: function(st) 
	    {
	        this.staemme.push(st);
	        
	        this.staemme[this.getStammCount()-1].position = this.getStammCount();
	        
	        this.writeStammCountToTab();
	    }, 

	    loescheStamm: function(st)
	    {
	    	;
	    },

	    speichern: function()
	    {
	    	var _kopfdaten = 
	    	{
				'name' :this.name,
				'bestand' :this.bestand,
				'datum' :this.datum
	    	}

	    	var _staemme = [];

	    	for(var i in this.staemme)
	    	{
	    		_staemme.push( 
				{
					'durchmesser' : this.staemme[i].durchmesser,
					'laenge' : this.staemme[i].laenge,
					'baumart' : this.staemme[i].baumart,
					'rindenAbzug' : (this.staemme[i].rindenAbzug) ? 1 : 0,
					'rindenAbzugWert' : this.staemme[i].rindenAbzugWert,
					'staerkeKlasse' : this.staemme[i].staerkeKlasse,
					'volumen' : this.staemme[i].volumen,
					'volumenOhne' : this.staemme[i].volumenOhne,
					'position' : this.staemme[i].position
				});
	    	}

	    	$.ajax(
    		{
    			method: "POST",
    			url: 'php/ajax.php',
    			data: { kopfdaten : _kopfdaten, staemme: _staemme, action : 'saveHieb'},
    			dataType : 'json'	
    		})
    		.done( function(resp)
			{
				d1.resolve( resp );
			});

	    }, 

	    isValid: function()
	    {
	    	this.valid = true;
	    	$('#layHieb div').removeClass('has-error');

	    	if(this.name.length == 0) 		{$('#grpName').addClass('has-error'); this.valid = false; } 
	    	if(this.bestand.length == 0) 	{$('#grpBestand').addClass('has-error'); this.valid = false; } 
	    	if(this.datum.length == 0) 		{$('#grpDatum').addClass('has-error'); this.valid = false; } 

	    	return this.valid;
	    }, 

	    getStammCount: function()
	    {
	    	return this.staemme.length;
	    }, 

	    getAbsoluteCount: function()
	    {
	    	var j = 0;

	    	for( var i in this.staemme)
	    	{
	    		if(typeof(this.staemme[i]) != 'undefined')
	    		{
	    			j++;
	    		}
	    	}

	    	return j;
	    }, 

	    sumKubatur: function()
	    {
	    	var j = 0;

	    	for( var i in this.staemme)
	    	{
	    		if(typeof(this.staemme[i]) != 'undefined')
	    		{
	    			j += this.staemme[i].volumen;
	    		}
	    	}

	    	return j;
	    },

	    sumKubaturOhne: function()
	    {
	    	var j = 0;

	    	for( var i in this.staemme)
	    	{
	    		if(typeof(this.staemme[i]) != 'undefined')
	    		{
	    			j += this.staemme[i].volumenOhne;
	    		}
	    	}

	    	return j;
	    },

		writeList: function()
		{
			$('.listEintrag').remove();

			for(var i in this.staemme)
			{
				var stamm = this.staemme[i];

				$('<tr class="listEintrag" data-stammnr="'+stamm.position+'"><td>'+stamm.position+'</td>'+'<td class="baum">'+baeume[stamm.baumart]['name']+'</td>'+'<td class="kub">'+ formatKub(stamm.volumen, 'round') +' fm</td><td class="kub">'+ formatKub(stamm.volumenOhne, 'round') +' fm</td><td class="del" data-target="#myModal" data-toggle="modal"><i class="fa fa-minus-square fa-2x"></i></td></tr>').insertAfter('#listeHead');
			}
		},

		writeListSum: function()
		{
			$('#kubSumme').html( formatKub( this.sumKubatur(),'round' ) );
			$('#kubSummeOhne').html( formatKub( this.sumKubaturOhne(),'round' ) );
		},

		writeStammCountToTab: function()
		{
			$('#stammCount').html( this.getAbsoluteCount() );
		},

		deleteStamm: function(stammnr)
		{
			delete( this.staemme[(stammnr-1)] );
		},

		checkboxSaveButton: function()
		{	
			if( this.getAbsoluteCount() > 0)
			{
				$('#saveNewHieb').removeAttr('disabled');
			}
			else
			{
				$('#saveNewHieb').attr('disabled', 'disabled');	
			}
		}, 

		changeValues: function(name, bestand, datum)
		{
			/* todo: auch von liste aus aktualisieren */
			this.name = name;
			this.bestand = bestand;
			this.datum = datum;
		}

	}

function Stamm(durchmesser, laenge, baumart, showInButton) 
{
	this.durchmesser = durchmesser;
	this.laenge = laenge;
	this.baumart = baumart;
	this.rindenAbzugWert = 0;
	this.staerkeKlasse = 0;
	this.volumen = 0;
	this.showInButton = showInButton;
	this.volumenOhne = 0;
	this.init();
}

Stamm.prototype = 
{
    init: function ()
    {
    	this.findStaerkeKlasse(this.durchmesser);
    	
    	this.findRindenAbzug(this.durchmesser);

    	this.berechnen();

    	if(this.showInButton)
    	{
    		this.writeToButton();
    	}
    },

   	berechnen: function()
   	{
   		this.volumen 		= formatKub(((Math.PI/4 * Math.pow( (this.durchmesser), 2) ) * this.laenge ) / 10000);
   		this.volumenOhne	= formatKub(((Math.PI/4 * Math.pow( (this.durchmesser-this.rindenAbzugWert), 2) ) * this.laenge ) / 10000);
	},

	writeToButton: function()
	{
		$('#volumenErgebnis').html( formatKub(this.volumen,'round') );
	},

   	findStaerkeKlasse: function()
	{
		var durchmesser = this.durchmesser;

		for( var i in staerkeKlassen)
		{
			if( durchmesser >= staerkeKlassen[i]['von'] && durchmesser <= staerkeKlassen[i]['bis'] )
			{
				this.staerkeKlasse = i;
				return;
			}
		}
	},

	findRindenAbzug: function()
	{
		var abzug = baeume[this.baumart]['abzug'];
		var staerkeKlasse = this.staerkeKlasse;

		for( var i in rindenAbzug[abzug])
		{
			if( staerkeKlasse >= rindenAbzug[abzug][i]['von'] && staerkeKlasse <= rindenAbzug[abzug][i]['bis'] )
			{
				this.rindenAbzugWert = rindenAbzug[abzug][i]['abzug'];
				return;
			}
		}
	}

}

function Archiv()
{
	
	this.init();
}
	
	Archiv.prototype = 
	{
    	init: function ()
    	{
    		var that = this;

    		$.ajax({
				method: "POST",
				url: 'php/ajax.php',
				data: { action : 'showHiebList'},
				dataType : 'json'	
			})
			.done( function(resp)
			{
				var out = '';

				for(var i in resp)
				{
					var date = formatDate(resp[i].datum);

					out += '<tr class="archivEntry" data-hiebid="'+resp[i].id+'"><td>'+date+'</td><td>'+resp[i].name+'</td><td>'+resp[i].bestand+'</td><td class="hidden-xs">'+resp[i].stammAnz+'</td><td class="hidden-xs">'+resp[i].kubSumMit+' fm</td><td class="hidden-xs">'+resp[i].kubSumOhne+' fm</td></tr>';
				}

				if ( $.fn.dataTable.isDataTable('#hiebList') )
				{
					$('#hiebList').DataTable().destroy();
				}

				$('#hiebList tbody').html('').html(out);
				$('#hiebList').DataTable({'paging':false,'language': {'url':'js/dataTables.german.lang'}, "order": [[ 0, "desc" ]]});

			});
    	},

    	writeList: function(hiebId)
    	{
    		$.ajax({
				method: "POST",
				url: 'php/ajax.php',
				data: { action : 'showHiebDetails', hiebid: hiebId},
				dataType : 'json'	
			})
			.done( function(resp)
			{
				var out = '';
				var baumart = -1;
				for(var i in resp)
				{
					
					var rinde = (resp[i].rindenabzug == '1') ? 'ja' : 'nein';
					/*
					if(baumart != resp[i].baumart ) {
						if(baumart!= -1) {
							out+='<tr><td colspan="5" align="right"></td><td align="right"><span id="detailKubaturMit_'+i+'">88</span></td> <td align="right"><span id="detailKubaturOhne_'+i+'">77</span></td> </tr>';
						}
						baumart = resp[i].baumart;
					}
					*/
					out += '<tr class="archivListEntry"><td>'+resp[i].position+'</td><td>'+baeume[resp[i].baumart].name+'</td><td>'+resp[i].laenge+' <span class="hidden-xs hidden-print"> m</span><span class="visible-print-inline-block" > m</span></td><td>'+resp[i].durchmesser+'<span class="hidden-xs hidden-print" > cm</span> <span class="visible-print-inline-block" > cm</span></td><td>'+staerkeKlassen[resp[i].staerkeklasse].name+'</td><td class="kub">'+resp[i].kubatur_mit+' fm</td><td class="kub">'+resp[i].kubatur_ohne+' fm</td></tr>';
				
				}

				$('#hiebDetails tbody').html('').html(out);
			});
    	}
    }