function addCell(tr, val) {
    var td = document.createElement('td');

    td.innerHTML = val;

    tr.appendChild(td)
  }

  function addRow(tbl, value) {
    var tr = document.createElement('tr');

    //addCell(tr, ...value);
    //addCell(tr, ...value);
    //addCell(tr, ...value);
	for(val of value){
		addCell(tr, val);
	}
    tbl.appendChild(tr)    
  }


 function show_data(datetime, max_story, btw_max_story, dataset){    
     tb1 = document.getElementById('tb1');     
     tb1.innerHTML = "";
     addRow(tb1, ['Max story', 'Between maxstory']); 
     addRow(tb1, [max_story, btw_max_story]); 

     tb2 = document.getElementById('tb2');     
     tb2.innerHTML = "";
     addRow(tb2, ['date', 'label', 'cx','cy', 'trend', 'story']);
     for (row of dataset){
        addRow(tb2, [datetime, row.label, row.forward, row.freq, row.trend, row.story])
     }
 }