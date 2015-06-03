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

		writeList: function()
		{
			$('.listEintrag').remove();

			for(var i in this.staemme)
			{
				var stamm = this.staemme[i];

				$('<tr class="listEintrag" data-stammnr="'+stamm.position+'"><td>'+stamm.position+'</td>'+'<td class="baum">'+baeume[stamm.baumart]['name']+'</td>'+'<td class="kub">'+ formatKub(stamm.volumen) +' fm</td><td class="del" data-target="#myModal" data-toggle="modal"><i class="fa fa-minus-square fa-2x"></i></td></tr>').insertAfter('#listeHead');
			}
		},

		writeListSum: function()
		{
			$('#kubSumme').html( formatKub( this.sumKubatur() ) );
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

function Stamm(durchmesser, laenge, baumart, rindenAbzug, showInButton) 
{
	this.durchmesser = durchmesser;
	this.laenge = laenge;
	this.baumart = baumart;
	this.rindenAbzug = rindenAbzug;
	this.rindenAbzugWert = 0;
	this.staerkeKlasse = 0;
	this.volumen = 0;
	this.showInButton = showInButton;

	this.init();
}

Stamm.prototype = 
{
    init: function ()
    {
    	this.findStaerkeKlasse(this.durchmesser);
    	
    	if(this.rindenAbzug)
    	{
    		this.findRindenAbzug(this.durchmesser);
    	}

    	this.berechnen();

    	if(this.showInButton)
    	{
    		this.writeToButton();
    	}
    },

   	berechnen: function()
   	{
   		this.volumen = formatKub(((Math.PI/4 * Math.pow( (this.durchmesser-this.rindenAbzugWert), 2) ) * this.laenge ) / 10000);
	},

	writeToButton: function()
	{
		$('#volumenErgebnis').html( formatKub(this.volumen) );
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

					out += '<tr class="archivEntry" data-hiebid="'+resp[i].id+'"><td>'+date+'</td><td>'+resp[i].name+'</td><td>'+resp[i].bestand+'</td><td class="hidden-xs">'+resp[i].stammAnz+'</td><td class="hidden-xs">'+formatKub(resp[i].kubSum)+' fm</td></tr>';
				}


				if ( !$.fn.dataTable.isDataTable('#hiebList') )
				{
					$('#hiebList tbody').html('').html(out);
					$('#hiebList').DataTable({'paging':false,'language': {'url':'js/dataTables.german.lang'}});
				}
				else
				{
					
					$('#hiebList tbody').html('').html(out);
					$('#hiebList').DataTable().fnDestroy();
					$('#hiebList').DataTable({'paging':false,'language': {'url':'js/dataTables.german.lang'}});
				}
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
				for(var i in resp)
				{
					var rinde = (resp[i].rindenabzug == '1') ? 'ja' : 'nein';

					out += '<tr class="archivListEntry"><td>'+resp[i].position+'</td><td>'+baeume[resp[i].baumart].name+'</td><td>'+resp[i].laenge+'</td><td>'+resp[i].durchmesser+'</td><td>'+staerkeKlassen[resp[i].staerkeklasse].name+'</td><td>'+rinde+'</td><td class="kub">'+resp[i].kubatur+' fm</td></tr>';
				}


				$('#hiebDetails tbody').html('').html(out);
			});
    	}
    }