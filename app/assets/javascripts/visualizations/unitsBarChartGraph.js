
function unitsBarChartGraph(category, categoryName, workerUpdateFunction, jobsUpdateFunction, annotationsUpdateFunction, getSelection, updateSelection, openModal, modalName) {
    var unitsJobChart = "";
    var unitsJobChartMaster = "";
    var unitsWordCountChart = "";
    var unitsWordCountChartMaster = "";
    var selectedUnits = [];
    var projectCriteria = "";
    var matchCriteria = "";
    var specificInfo = {};

    var specificFields = {
        '#relex-structured-sentence_tab':{ data : "words", info:['domain', 'format', 'relation', 'sentence' ],
            tooltip:"Number of words in the sentence. Click to select/deselect",
            labelsInfo:['domain','format', 'seed relation', 'sentence' ], sendInfo: 'sentence',
            query : '&project[words]=content.properties.sentenceWordCount' +'&project[domain]=domain' +'&project[format]=format'+
            '&project[sentence]=content.sentence.formatted&project[relation]=content.relation.noPrefix' +
            '&project[id]=_id&push[id]=id&push[domain]=domain&push[format]=format&push[words]=words&push[sentence]=sentence&push[relation]=relation&'},

       '#fullvideo_tab':{ data : "keyframes", info:['domain','format', 'title', 'keyframes' ,'description'],
           tooltip:"Number of key frames in video. Click to select/deselect", sendInfo: 'title',
           labelsInfo:['domain','format', 'title', 'key frames', 'description'],
           query : '&project[keyframes]=keyframes.count' +'&project[domain]=domain' +'&project[format]=format'+
            '&project[title]=content.metadata.title&project[description]=content.metadata.description' +
            '&project[id]=_id&push[id]=id&push[title]=title&push[domain]=domain&push[format]=format&' +
                'push[description]=description&push[keyframes]=keyframes&'},

        '#metadatadescription_tab':{ data : "words", info:['domain', 'format', 'title', 'words', 'features', 'description'],
            tooltip:"Number of words in video description. Click to select/deselect",
            sendInfo: 'title',
            labelsInfo:['domain', 'format', 'title', 'words', 'features', 'description'],
            query : '&project[words]=wordCount' +'&project[domain]=domain' +'&project[format]=format'+
                '&project[title]=title&project[description]=content.description' +
                '&project[features]=totalNoOfFeatures'+
                '&project[id]=_id&push[words]=words&push[id]=id&push[features]=features' +
                '&push[title]=title&push[domain]=domain&push[format]=format&' +
                'push[description]=description&'},

       '#drawing_tab':{ data : "features", info:['domain', 'format', 'title', 'features', 'author', 'description', 'url'],
            tooltip:"Number of relevant features in the image. Click to select/deselect",
            sendInfo: 'title',
            labelsInfo:['domain', 'format', 'title', 'relevant features', 'author', 'description', 'url'],
            query : '&project[features]=totalRelevantFeatures' +'&project[domain]=domain' +'&project[format]=format'+
                '&project[title]=content.title&project[description]=content.description' +
                '&project[author]=content.author&project[url]=content.url'+
                '&project[id]=_id&push[features]=features&push[id]=id&push[author]=author&push[url]=url' +
                '&push[title]=title&push[domain]=domain&push[format]=format&' +
                'push[description]=description&'},

       '#all_tab':{ data : "keyframes", info:['domain','format', 'documentType'],
               tooltip:"Click to select/deselect", sendInfo: 'documentType',
               labelsInfo:['domain','format', 'document type'],
               query : '&project[domain]=domain' +'&project[format]=format'+'&project[documentType]=documentType&' +
                   'project[id]=_id&push[id]=id&push[domain]=domain&push[format]=format&push[documentType]=documentType&'}

    }


    var colors = [ '#0D233A','#2F7ED8','#77A1E5' ,'#F28F43', '#A7C96C', '#492970' ];

    var chartSeriesOptions = {
        'workers': {
            'potentialSpamWorkers': {'color': '#FF0000', 'field': 'cache.workers.potentialSpam', 'name':'# of inconsistent quality workers', 'type': 'column',
            tooltip: "Number of workers whose annotations, on a unit, were marked as low quality in some jobs and high quality in others. Click to select/deselect."},
            'spamWorkers': {'color': '#A80000', 'field': 'cache.workers.spam', 'name':'# of low quality workers', 'type': 'column',
                tooltip: "Number of low quality workers who annotated a unit. Click to select/deselect."},
            'workers': {'color': '#3D0000', 'field': 'cache.workers.nonSpam', 'name':'# of high quality workers', 'type': 'column',
                tooltip:  "Number of high quality workers who annotated a unit. Click to select/deselect."},
            'avgWorkers': {'color': '#A63800', 'field': '', 'name':'avg # of workers', 'type': 'spline', 'dashStyle':'shortdot',
                tooltip: "Average number workers who annotated a unit. Click to select/deselect."}},
        'judgements': {
            'spamJudgements': {'color': '#60D4AE', 'field': 'cache.workerunits.spam', 'name':'# of low quality judgements', 'type': 'column',
                tooltip: "Number of low quality judgements for a unit. Click to select/deselect."},
            'judgements': {'color': '#207F60', 'field': 'cache.workerunits.nonSpam', 'name':'# of high quality judgements', 'type': 'column',
                tooltip: "Number of high quality judgements for a unit. Click to select/deselect."},
            'avgWorkerunits': {'color': '#00AA72', 'field': '', 'name':'avg # of judgements', 'type': 'spline', 'dashStyle':'shortdot',
                tooltip: "Average number judgements for a unit. Click to select/deselect."}},
        'batches': { 'batches': {'color': '#FF9E00', 'field': 'cache.batches.count', 'name':'# of batches', 'type': 'spline', 'dashStyle':'LongDash',
            tooltip: "Number of batches the sentence was used in. Click to select/deselect."}},
        'avg_clarity': {
            'avg_clarity': {'color': '#6B8E23', 'field': 'avg_clarity', 'name':'avg unit clarity', 'type': 'spline', 'dashStyle':'Solid',
                tooltip: "Average Unit Clarity: the value is defined as the maximum unit annotation score achieved on any annotation for that unit. High agreement over the annotations is represented by high cosine scores, indicating a clear unit. Click to select/deselect."}}
    }

    var chartGeneralOptions = {
        chart: {
            resetZoomButton: {

                theme:{
                    fill: '#2aabd2',
                    style:{
                        color:'white'
                    }
                },
                position:{
                    x: 50,
                    y: -90
                }
            },
            marginLeft: 120,
            marginRight: 180,
            zoomType: 'x',
            alignTicks: false,
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(245, 245, 255)']
                ]
            },
            //spacingBottom: 70,
            renderTo: 'generalBarChart_div',
           // marginBottom: 90,
			width: ($('.maincolumn').width() - 0.05*($('.maincolumn').width())),
            height: 450,
            marginTop: 100,
            events:{
                load: function(){
                    var chart = this,
                        legend = chart.legend;

                    var selectedUnits = getSelection();
                    var currentSelectedUnits = [];
                    for (var idUnitIter in selectedUnits){
                        var categoryName = selectedUnits[idUnitIter];
                        for (var iterData = 0; iterData < chart.series[0].data.length; iterData++) {

                            if (categoryName == chart.series[0].data[iterData]['category']) {
                                currentSelectedUnits.push(categoryName);
                                for (var iterSeries = 0; iterSeries < chart.series.length; iterSeries++) {

                                    chart.series[iterSeries].data[iterData].select(null,true)

                                }
                            }

                        }
                    }
                    var buttonLength = this.exportSVGElements.length;
                    if (currentSelectedUnits.length > 0) {
                        this.exportSVGElements[buttonLength - 2].show();
                    } else {
                        this.exportSVGElements[buttonLength - 2].hide();
                    }

                    if(chart.renderTo.id == 'generalBarChart_div' ) {
                        var selectedInfo = {};
                        for (var index in currentSelectedUnits) {
                            selectedInfo[currentSelectedUnits[index]] = {};
                            selectedInfo[currentSelectedUnits[index]]['tooltipLegend'] = {}
                            selectedInfo[currentSelectedUnits[index]]['tooltipLegend']['Sentence'] = specificInfo[currentSelectedUnits[index]][specificFields[category]['sendInfo']];
                            selectedInfo[currentSelectedUnits[index]]['tooltipChart'] = {};
                            selectedInfo[currentSelectedUnits[index]]['tooltipChart']['unit avg clarity across jobs'] = specificInfo[currentSelectedUnits[index]]['avg_clarity'];
                        }
                        workerUpdateFunction.update(currentSelectedUnits, selectedInfo);
                        jobsUpdateFunction.update(currentSelectedUnits, selectedInfo);
                        annotationsUpdateFunction.update(currentSelectedUnits , selectedInfo);
                    }
                }
            }

        },
        exporting: {
            buttons: {
                resetButton: {
                    text: "Reset selection",
                    theme: {
                        fill: '#2aabd2',
                        style:{
                            color: 'white'
                        }
                    },
                    onclick: function(e) {
                        if (selectedUnits.length == 0) return;
                        var selectedGraph = unitsWordCountChart;
                        var unSelectedGraph = unitsJobChart;
                        var masterGraph = unitsWordCountChartMaster;

                        if(this.renderTo.id == 'generalBarChart_div' ) {
                            selectedGraph = unitsJobChart;
                            unSelectedGraph = unitsWordCountChart;
                            masterGraph = unitsJobChartMaster;
                        }

                        for (var iterData = 0; iterData < selectedGraph.series[0].data.length; iterData++) {
                            for (var iterSeries = 0; iterSeries < selectedGraph.series.length; iterSeries++) {
                                selectedGraph.series[iterSeries].data[iterData].select(false,true);
                                masterGraph.series[iterSeries].data[iterData].select(false,true);
                            }
                        }
                        var buttonLength = this.exportSVGElements.length;
                        this.exportSVGElements[buttonLength - 2].hide();

                        if (selectedGraph == unitsWordCountChart) return;

                        for (var iterSelection in selectedUnits) {
                            updateSelection(selectedUnits[iterSelection]);
                        }

                        selectedUnits = [];
                        var selectedInfo = {};
                        workerUpdateFunction.update(selectedUnits, selectedInfo);
                        jobsUpdateFunction.update(selectedUnits, selectedInfo);
                        annotationsUpdateFunction.update(selectedUnits , selectedInfo);

                    }
                }
            }
        },

        title: {
            text: 'Overview of units used in jobs',
            style: {
                fontWeight: 'bold'
            }
        },
        legend:{
            enabled: false
            //y: 70
        },
        subtitle: {
            text: 'Select area to zoom. To see detailed information select individual units'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            events:{
                setExtremes :function (event) {
                    var graph = '';
                    var masterGraph = "";
                    if(this.chart.renderTo.id == 'generalBarChart_div' ) {
                        graph = unitsJobChart;
                        masterGraph =  unitsJobChartMaster;
                    } else {
                        graph = unitsWordCountChart;
                        masterGraph =  unitsWordCountChartMaster;
                    }
                    var min = 0;
                    if (event.min != undefined){
                        min = event.min;
                    }
                    var max = graph.series[0].data.length
                    if (event.max != undefined){
                        max = event.max;
                    }
                   // chart.yAxis[0].options.tickInterval
                    graph.xAxis[0].options.tickInterval = Math.ceil( (max-min)/20);
                    masterGraph.xAxis[0].removePlotBand('mask-select');
                    masterGraph.xAxis[0].addPlotBand({
                        id: 'mask-select',
                        from: min,
                        to: max,
                        color: 'rgba(0, 0, 0, 0.2)'
                    });
                },
                afterSetExtremes :function(event){
                    var graph = '';
                    var interval = (event.max - event.min + 1);
                    var title = ""
                    if(this.chart.renderTo.id == 'generalBarChart_div' ) {
                        if (interval == unitsJobChart.series[0].data.length) {
                            title = 'Overview of ' + unitsJobChart.series[0].data.length + ' Units used in Jobs';
                        } else {
                            if(unitsJobChart.series[0].data.length > 0){
                                title = 'Overview of ' + interval.toFixed(0) + '/' + unitsJobChart.series[0].data.length + ' Units used in Jobs';
                            }else {
                                title = 'Overview of ' + unitsJobChart.series[0].data.length + ' Units used in Jobs';
                            }
                        }
                        unitsJobChart.setTitle({text: title});
                    } else {
                        if (interval == unitsWordCountChart.series[0].data.length) {
                            title = 'Overview of ' + unitsWordCountChart.series[0].data.length + ' Units used in Jobs';
                        } else {
                            if(unitsWordCountChart.series[0].data.length > 0) {
                                title = 'Overview of ' + interval.toFixed(0) + '/' + unitsWordCountChart.series[0].data.length + ' Units used in Jobs';
                            } else {
                                title = 'Overview of ' + unitsWordCountChart.series[0].data.length + ' Units used in Jobs';
                            }
                        }
                        unitsWordCountChart.setTitle({text: title});
                    }
                }
            },
            labels: {
                formatter: function() {
                    if(this.value.split != undefined) {
                        var arrayID = this.value.split("/");
                        return arrayID[arrayID.length - 1];
                    } else {
                        return this.value;
                    }

                }
            },
            title :{
                text: 'Unit ID'
            }
        },
        tooltip: {
            hideDelay:10,
            useHTML : true,
            positioner: function (labelWidth, labelHeight, point) {
                var selectedGraph = unitsWordCountChart;

                if(this.chart.renderTo.id == 'generalBarChart_div' ) {
                    selectedGraph = unitsJobChart;
                }
                var tooltipX, tooltipY;
                if (point.plotX + labelWidth > selectedGraph.plotWidth) {
                    tooltipX = point.plotX + selectedGraph.plotLeft - labelWidth - 20;
                } else {
                    tooltipX = point.plotX + selectedGraph.plotLeft + 20;
                }
                tooltipY = point.plotY - labelHeight + selectedGraph.plotTop + 10 ;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            },
            formatter: function() {
                var arrayID = this.x.split("/");
                var id =  arrayID[arrayID.length - 1];
                var s = '<div style="white-space:normal;"><b>' + categoryName + ' </b>'+ id +'<br/>';
                for ( var indexField in specificFields[category]['info']) {
                    if(indexField == (specificFields[category]['info'].length - 1)) break;

                    var field = specificFields[category]['info'][indexField];
                    if (typeof specificInfo[this.x][field] === 'string') {
                        s +=  '<b>'+ specificFields[category]['labelsInfo'][indexField]  + ' : </b>' + specificInfo[this.x][field] + '<br/>';
                    } else {
                        for(var indexInfo in specificInfo[this.x][field]) {
                            s +=  '<b>' + field + ' (' + indexInfo + ') : </b>' + specificInfo[this.x][field][indexInfo] + '<br/>';
                        }
                    }
                }
                var seriesOptions = {};
                $.each(this.points, function(i, point) {
                    var pointValue = point.y
                    if (!(pointValue % 1 === 0)) {
                        pointValue = point.y.toFixed(2);
                    }
                    var percentage = point.percentage

                    if (!(percentage % 1 === 0)) {
                        percentage = percentage.toFixed(2);
                    }
                    var line = '<tr><td></td><td style="color: ' + point.series.color + ';text-align: left">   ' + point.series.name +':</td>'+
                        '<td style="text-align: right">' + pointValue;
                    if(point.series.stackKey != "spline"){
                        line  += ' (' + percentage +' %)</td></tr>';
                    } else {
                        line  += '</td></tr>';
                    }
                    if (point.series.yAxis.axisTitle.text in seriesOptions) {
                        seriesOptions[point.series.yAxis.axisTitle.text]['items'].push(line);
                        if(point.series.stackKey != "spline"){
                            seriesOptions[point.series.yAxis.axisTitle.text]['totalValue'] += point.y;
                        }
                    } else {
                        seriesOptions[point.series.yAxis.axisTitle.text] = {};
                        seriesOptions[point.series.yAxis.axisTitle.text]['items'] = [];
                        seriesOptions[point.series.yAxis.axisTitle.text]['items'].push(line);
                        seriesOptions[point.series.yAxis.axisTitle.text]['totalValue'] = -1;
                        if(point.series.stackKey != "spline"){
                            seriesOptions[point.series.yAxis.axisTitle.text]['totalValue'] = point.y;}


                    }
                });
                s += '<table calss="table table-condensed">';
                for (var item in seriesOptions)
                {
                    var totalValue = "";
                    if (seriesOptions[item]['totalValue'] != -1) {
                        totalValue = '<td style="text-align: right">'+ seriesOptions[item]['totalValue'] +' </td>';
                    }
                    var yAxisValue = '<tr><td> </td><td style="text-align: left"><b>' + item +':</b></td>' + totalValue + '</tr>';

                    if(seriesOptions[item]['items'].length > 1) {
                        s += yAxisValue;
                    }
                    for(var li in seriesOptions[item]['items']) {
                        s += seriesOptions[item]['items'][li];
                    }

                }
                s += '</table>';

                var lastIndex = specificFields[category]['info'].length - 1;
                var field = specificFields[category]['info'][lastIndex];

                if (typeof specificInfo[this.x][field] === 'string') {
                    if((specificFields[category]['labelsInfo'][lastIndex]  == 'url') && (category == '#drawing_tab')) {
                        s +=  '<img width="240" height="160" src="' + specificInfo[this.x][field] + '">'
                    } else {
                        s +=  '<b>'+ specificFields[category]['labelsInfo'][lastIndex]  + ' : </b>' + specificInfo[this.x][field] + '<br/>';
                    }
                } else {
                    for(var indexInfo in specificInfo[this.x][field]) {
                        s +=  '<b>' + field + ' (' + indexInfo + ') : </b>' + specificInfo[this.x][field][indexInfo] + '<br/>';
                    }
                }
                return s;
            },
            shared: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                //allowPointSelect: true,
                states: {

                    select: {
                        color: null,
                        borderWidth: 2,
                        borderColor:'Blue'
                    }
                },

                pointPadding: 0.01,
                borderWidth: 0.01,

                //cursor: 'pointer',
                point: {
                    events: {
                        contextmenu: function (e) {
                            anchorModal = $('<a class="testModal" id="' + this.category + '"' +
                                'data-modal-query="unit=' + this.category+
                                '" data-api-target="/api/analytics/unit?" ' +
                                'data-target="' + modalName + '" data-toggle="tooltip" data-placement="top" title="" ' +
                                'data-original-title="Click to see the individual worker page">6345558 </a>');
                            //$('body').append(anchorModal);
                            openModal(anchorModal, category);
                        },
                        click: function () {
                            var selectedGraph = unitsWordCountChart;
                            var unSelectedGraph = unitsJobChart;
                            var masterGraph = unitsWordCountChartMaster;

                            if(this.series.chart.renderTo.id == 'generalBarChart_div' ) {
                                selectedGraph = unitsJobChart;
                                unSelectedGraph = unitsWordCountChart;
                                masterGraph = unitsJobChartMaster;
                            }

                            for (var iterSeries = 0; iterSeries < selectedGraph.series.length; iterSeries++) {
                                selectedGraph.series[iterSeries].data[this.x].select(null,true)
                                masterGraph.series[iterSeries].data[this.x].select(null,true)
                            }

                            if($.inArray(this.category, selectedUnits) > -1) {
                                selectedUnits.splice( $.inArray(this.category, selectedUnits), 1 );
                            } else {
                                selectedUnits.push(this.category)
                            }

                            var buttonLength = selectedGraph.exportSVGElements.length;
                            if(selectedGraph.getSelectedPoints().length == 0) {
                                selectedGraph.exportSVGElements[buttonLength - 2].hide();
                            } else {
                                selectedGraph.exportSVGElements[buttonLength - 2].show();
                            }

                            updateSelection(this.category);

                            if (selectedGraph == unitsWordCountChart) return;


                            var selectedInfo = {};
                            for (var index in selectedUnits) {
                                selectedInfo[selectedUnits[index]] = {};
                                selectedInfo[selectedUnits[index]]['tooltipLegend'] = {}
                                selectedInfo[selectedUnits[index]]['tooltipLegend']['Sentence'] = specificInfo[selectedUnits[index]][specificFields[category]['sendInfo']];
                                selectedInfo[selectedUnits[index]]['tooltipChart'] = {};
                                selectedInfo[selectedUnits[index]]['tooltipChart']['unit avg clarity across jobs'] = specificInfo[selectedUnits[index]]['avg_clarity'];
                            }
                            workerUpdateFunction.update(selectedUnits, selectedInfo);
                            jobsUpdateFunction.update(selectedUnits, selectedInfo);
                            annotationsUpdateFunction.update(selectedUnits , selectedInfo);

                        }
                    }
                }
            }
        }
    };



    var computeBarChartProjectData = function(){

        projectCriteria = "";
        for (var key in chartSeriesOptions) {
            var yAxisSeries = chartSeriesOptions[key];
            for (var key in yAxisSeries) {
                if(yAxisSeries[key]['field']!= ""){
                    projectCriteria += "&project[" + key + "]=" + yAxisSeries[key]['field'];
                }
            }
        }

    }

    var getLimit = function(value){
        return value;
    }

    var getBarChartData = function(newMatchCriteria, sortCriteria){
        chartGeneralOptions.series = [];
        chartGeneralOptions.yAxis = [];
        if(sortCriteria == ""){
            sortCriteria = '&sort[created_at]=1';
        }
        if(newMatchCriteria == ""){
            newMatchCriteria = matchCriteria;
        }


        var url = '/api/analytics/unitgraph/?' + '&match[cache.jobs.count][>]=0' +
                    newMatchCriteria +
                    sortCriteria +
                    specificFields[category]['query'] +
                    projectCriteria;

        $.getJSON(url, function(data) {
            var subTitle = "Overview of " + categoryName;
            var selectionOptions = "";
            for (var option in data['query']) {
                //default query
                if( option != 'documentType') {
                    var columnName = $( 'th[data-query-key*="' + option + '"]').html();
                    selectionOptions += columnName + " ";
                    var connectionStr = " and ";
                    for (var key in data['query'][option]) {
                        if (key == 'like'){
                            selectionOptions += key + ' "' + data['query'][option][key] + '"' + connectionStr;
                            continue;
                        }

                        selectionOptions += key + " " + data['query'][option][key] + connectionStr;
                    }

                    selectionOptions = selectionOptions.substring(0, selectionOptions.length - connectionStr.length) +  ",";
                }
            }
            if (!(selectionOptions === "")) {
                subTitle += " having " + selectionOptions.substring(0, selectionOptions.length - 1);
            }


            chartGeneralOptions['xAxis']['categories'] = data["id"];

            //create the yAxis and series option fields
            chartGeneralOptions.yAxis = [];
            chartGeneralOptions.series = [];

             for (var indexData in data['id']) {
                var id = data['id'][indexData];
                specificInfo[id] = {};
                for ( var indexField in specificFields[category]['info']) {
                    var field = specificFields[category]['info'][indexField];
                    specificInfo[id][field] = data[field][indexData];
                }
                specificInfo[id]['avg_clarity']= data['avg_clarity'][indexData];
            }

            var startIndex = Math.ceil(2* data["id"].length/5);
            var stopIndex = Math.ceil(3* data["id"].length/5);
            if (stopIndex - startIndex < 2) {
                startIndex = 0;
                stopIndex = 2;
            }
            if (stopIndex - startIndex > 100){
                stopIndex = startIndex + 100;
            }
            var offsetRight = 0;
            var offsetLeft = 0;
            for (var key in chartSeriesOptions) {
                var yAxisSeriesGroup = chartSeriesOptions[key];
                var color = 'black';

                var totalValue = 0;
                var max = 0;
                for (var series in yAxisSeriesGroup) {

                    var newSeries = {
                        name: yAxisSeriesGroup[series]['name'],
                        color: yAxisSeriesGroup[series]['color'],
                        yAxis: chartGeneralOptions.yAxis.length,
                        type: yAxisSeriesGroup[series]['type'],
                        tooltipValue: yAxisSeriesGroup[series]['tooltip'],
                        data: data[series],
                        visible: false
                    }
                    var newMax = Math.max.apply(Math, data[series]);
                    if(newMax > max) {
                        max = newMax;
                    }
                    if ("tooltip" in yAxisSeriesGroup[series]) {
                        newSeries['tooltip'] = yAxisSeriesGroup[series]['tooltip'];
                    }
                    if(yAxisSeriesGroup[series]['type'] == 'column') {
                        newSeries['stack'] =  key;
                        newSeries['visible'] = true;
                        totalValue += newMax;
                    } else {
                        newSeries['dashStyle'] =  yAxisSeriesGroup[series]['dashStyle'];
                    }

                    chartGeneralOptions.series.push(newSeries);
                    color = yAxisSeriesGroup[series]['color'];

                }
                if (key == '# jobs') color = '#000000';

                var yAxisSettings = {
                    //gridLineWidth: 0,
                    offset: 0,
                    showEmpty: false,
                    labels: {
                        formatter: function () {
                            return this.value;
                        },
                        style: {
                            color: color
                        }
                    },
                    gridLineColor:  color,
                    startOnTick: false,
                    endOnTick: false,
                    min: 0,
                   // max: 0,
                    title: {
                        text: key,
                        style: {
                            color: color
                        }
                    },
                    opposite: false
                };

                if(key == 'workers' || key =='# jobs' || key == 'judgements') {
                    yAxisSettings.opposite = true;
                    yAxisSettings.offset = offsetLeft;
                    offsetLeft += 60;
               //     yAxisSettings.max = getLimit(totalValue);

                } else {
             //       yAxisSettings.max = getLimit(max);
                    yAxisSettings.offset = offsetRight;
                    offsetRight += 60;
                }
                //we want the same maximum for workers and judgements
                if (key == 'judgements'){
                    var maxValueBothAxis = chartGeneralOptions.yAxis[ chartGeneralOptions.yAxis.length - 1].max;
                    if (totalValue > maxValueBothAxis) {
                        maxValueBothAxis = totalValue;
                    }
               //     chartGeneralOptions.yAxis[ chartGeneralOptions.yAxis.length - 1].max = maxValueBothAxis;
               //     yAxisSettings.max = maxValueBothAxis;
                }

                chartGeneralOptions.yAxis.push(yAxisSettings);
            }
            chartGeneralOptions.chart.marginRight = 180
            chartGeneralOptions.chart.resetZoomButton.position.x = 45
            chartGeneralOptions.xAxis.tickInterval = Math.ceil( data["id"].length/20);
            chartGeneralOptions.chart.renderTo = 'generalBarChart_div';
            chartGeneralOptions.title.text = 'Overview of Units ' + data["id"].length +  ' used in Jobs';
            chartGeneralOptions.subtitle.text = subTitle + '<br/>'+ 'Select an area to zoom. To see detailed information select individual units.Right click for table view. From legend select/deselect features.Adjust Y-Axis by dragging the labels(double click to return to default).'
            chartGeneralOptions.plotOptions.series.pointPadding = 0.01;
            chartGeneralOptions.plotOptions.series.borderWidth = 0.01;
            chartGeneralOptions.plotOptions.series.minPointLength = 2;
            chartGeneralOptions.legend.y = 70;
            unitsJobChart = new Highcharts.Chart(chartGeneralOptions);



            unitsJobChartMaster = createMaster(chartGeneralOptions.series, chartGeneralOptions['xAxis']['categories'], chartGeneralOptions.yAxis, 'generalBarChartMaster_div',unitsJobChart, startIndex, stopIndex, 180);
            unitsJobChart.xAxis[0].setExtremes(startIndex, stopIndex);
            unitsJobChart.showResetZoom();
        });
    }
    var drawBarChart = function(matchStr,sortStr) {
        var url = '/api/analytics/jobtypes';
        //add the job type series to graph
        chartSeriesOptions['# jobs']={};
        $.getJSON(url, function(data) {
            $.each(data, function (key,value) {

                chartSeriesOptions['# jobs'][data[key]] = {'color': colors[key % colors.length],
                    'field': 'cache.jobs.types.' + data[key] + '.count', 'name':'# of ' + data[key] + ' jobs', 'type': 'column',
                    tooltip: 'Number of ' + data[key]  + ' jobs in which a unit was used. Click to select/deselect.'};
            });
            computeBarChartProjectData();
            getBarChartData(matchStr, sortStr);
        });
    }

    var drawSpecificBarChart = function(newMatchCriteria, sortCriteria){
        var newChartGeneralOptions = chartGeneralOptions;
        if(sortCriteria == ""){
            sortCriteria = '&sort[created_at]=1';
        }
        if(newMatchCriteria == ""){
            newMatchCriteria = matchCriteria;
        }
        //get the word count data
        var url = '/api/analytics/aggregate/?' +
            newMatchCriteria +
            '&match[cache.jobs.count][<]=1' +
            sortCriteria +
            specificFields[category]['query'];

        $.getJSON(url, function(data) {
            var subTitle = "Overview of " + categoryName;
            var selectionOptions = "";
            for (var option in data['query']) {
                //default query
                if(option != 'documentType') {
                    var columnName = $( 'th[data-query-key*="' + option + '"]').html();
                    selectionOptions += columnName + " ";
                    var connectionStr = " and ";
                    for (var key in data['query'][option]) {
                        if (key == 'like'){
                            selectionOptions += key + ' "' + data['query'][option][key] + '"' + connectionStr;
                        }
                        else {
                            selectionOptions += key + " " + data['query'][option][key] + connectionStr;
                        }
                    }

                    selectionOptions = selectionOptions.substring(0, selectionOptions.length - connectionStr.length) +  ",";
                }
            }
            if (!(selectionOptions === "")) {
                subTitle += " having " + selectionOptions.substring(0, selectionOptions.length - 1);
            }

            var startIndex = Math.ceil(2* data["id"].length/5);
            var stopIndex = Math.ceil(3* data["id"].length/5);
            if (stopIndex - startIndex < 2) {
                startIndex = 0;
                stopIndex = 2;
            }
            if (stopIndex - startIndex > 100){
                stopIndex = startIndex + 100;
            }
            for (var indexData in data['id']) {
                var id = data['id'][indexData];
                specificInfo[id] = {};
                for ( var indexField in specificFields[category]['info']) {
                    var field = specificFields[category]['info'][indexField];
                    specificInfo[id][field] = data[field][indexData];
                }
            }

            newChartGeneralOptions['xAxis']['categories'] = data["id"];

            //create the yAxis and series option fields
            newChartGeneralOptions.yAxis = [];
            newChartGeneralOptions.series = [];
            var newSeries = {
                name: '# of ' + specificFields[category]['data'],
                color: '#6B8E23',
                yAxis: 0,
                type: 'column',
                tooltipValue: specificFields[category]['tooltip'],
                data: data[specificFields[category]['data']],
                visible: true
            };
            newChartGeneralOptions.series.push(newSeries);

            var max = Math.max.apply(Math, data[specificFields[category]['data']]);
            max += 10;

            var yAxisSettings = {
                gridLineWidth: 0,
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    style: {
                        color: '#6B8E23'
                    }
                },
                min: 0,
                offset: 60,
                gridLineColor:  '#6B8E23',
                startOnTick: false,
                endOnTick: false,
              //  max: max,
                title: {
                    text: '# of ' + specificFields[category]['data'],
                    style: {
                        color: '#6B8E23'
                    }
                },
                opposite: false
            };
            newChartGeneralOptions.chart.marginRight = 0
            newChartGeneralOptions.chart.resetZoomButton.position.x = -60
            newChartGeneralOptions.yAxis.push(yAxisSettings);
            newChartGeneralOptions.xAxis.tickInterval = Math.ceil( data["id"].length/20);
            newChartGeneralOptions.chart.renderTo = 'specificBarChart_div';
            newChartGeneralOptions.title.text = 'Overview of ' + data["id"].length + ' Units not used in Jobs';
            newChartGeneralOptions.subtitle.text = subTitle + '<br/>'+ 'Select area to zoom. To see detailed information select individual units.Right click for table view. From legend select/deselect features';
            newChartGeneralOptions.plotOptions.series.pointPadding = 0;
            newChartGeneralOptions.plotOptions.series.minPointLength = 2;
            newChartGeneralOptions.plotOptions.series.borderWidth = 0;
            newChartGeneralOptions.legend.y = 70;
            unitsWordCountChart = new Highcharts.Chart(newChartGeneralOptions);
            unitsWordCountChartMaster = createMaster(newChartGeneralOptions.series, data["id"], newChartGeneralOptions.yAxis, 'specificBarChartMaster_div', unitsWordCountChart, startIndex, stopIndex, 0);
            unitsWordCountChart.xAxis[0].setExtremes(startIndex, stopIndex);
            unitsWordCountChart.showResetZoom();
        });
    }

    this.createBarChart = function(matchStr, sortStr){
        matchStr = matchStr + '&';
        if(matchStr.indexOf("orderBy") > -1) {
            var secondHalf = matchStr.substring(matchStr.indexOf("orderBy")+8,matchStr.length);
            var sortCriteria = secondHalf.substring(0, secondHalf.indexOf(']'));
            var sortType = secondHalf.substring(0, secondHalf.indexOf('&')).indexOf('asc');
            if(sortCriteria == "") sortCriteria = 'created_at';
            if(sortType > 0){
                sortStr= '&sort[' + sortCriteria + ']=1';
            } else {
                sortStr= '&sort[' + sortCriteria + ']=-1';
            }
        } else {
            sortStr = '&sort[' + 'created_at' + ']=1'
        }
        drawBarChart(matchStr,sortStr);
        if (category != '#all_tab') {
            drawSpecificBarChart(matchStr,sortStr);
        } else {
            $('#specificBarChart_div').highcharts().destroy();
        }


    }


    // create the master chart
    function createMaster(seriesData, categories, yAxis, divName, chart, startIndex, stopIndex, marginRight) {
        var series = [];
        for (var iterAxis in yAxis) {
            yAxis[iterAxis]['gridLineWidth'] = 0;
        }
        for (var iterSeries in seriesData) {
            var serie = {
                //type: 'area',
                name: seriesData[iterSeries].name,
                yAxis : seriesData[iterSeries].yAxis,
                /* pointInterval: 24 * 3600 * 1000,
                 pointStart: Date.UTC(2006, 0, 01),*/
                tooltipValue: seriesData[iterSeries].tooltipValue,
                data: seriesData[iterSeries].data,
                color: seriesData[iterSeries].color,
                visible: seriesData[iterSeries].visible
            }
            series.push(serie);
        }

        var masterChart = new Highcharts.Chart({
            chart: {
                marginLeft: 120,
                marginRight: marginRight,
                borderWidth: 0,
                renderTo: divName,
                //backgroundColor: null,
                alignTicks: false,
                width: ($('.maincolumn').width() - 0.05*($('.maincolumn').width())),
                height: 150,
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [1, 'rgb(245, 245, 255)']
                    ]
                },
                zoomType: 'x',
                events: {


                    load: function () {
                            var chart = this,
                                legend = chart.legend;

                            for (var i = 0, len = legend.allItems.length; i < len; i++) {
                                var item = legend.allItems[i].legendItem;
                                var tooltipValue =  legend.allItems[i].userOptions.tooltipValue;
                                item.attr("data-toggle","tooltip");
                                item.attr("title", tooltipValue);

                            }


                        },
                    selection: function(event) {

                        if (event.resetSelection) {
                            return false;
                        }
                        var min = event.xAxis[0].min;
                        var max = event.xAxis[0].max;
                        // move the plot bands to reflect the new detail span
                        this.xAxis[0].removePlotBand('mask-select');
                        this.xAxis[0].addPlotBand({
                            id: 'mask-select',
                            from: min,
                            to: max,
                            color: 'rgba(0, 0, 0, 0.2)'
                        });

                        chart.xAxis[0].setExtremes(min, max);
                        if (chart.resetZoomButton == undefined){
                            chart.showResetZoom();
                        }


                        return false;
                    }
                }
            },
            title: {
                text: null
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        var arrayID = this.value.split("/");
                        return arrayID[arrayID.length - 1];
                    }
                },
                tickInterval: Math.ceil( categories.length/20),
                categories : categories,
                title :{
                    text: 'Unit ID'
                },
                showLastTickLabel: true,
                plotBands: [{
                    id: 'mask-select',
                    from: startIndex,
                    to: stopIndex,
                    color: 'rgba(0, 0, 0, 0.2)'
                }]

            },
            yAxis: yAxis,/*{
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                min: 0.6,
                showFirstLabel: false
            },*/
            tooltip: {
                formatter: function() {
                    return false;
                }
            },
            /*legend: {
                enabled: false
            },*/
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 70],
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, 'rgba(255,255,255,0)']
                        ]
                    },
                    events: {
                        legendItemClick: function () {
                            if(chart.series[this._i].visible) {
                                chart.series[this._i].hide();
                            } else {
                                chart.series[this._i].show();
                            }
                            //return false;
                            // <== returning false will cancel the default action
                        }
                    },
                    lineWidth: 1,
                    marker: {
                        symbol: 'circle',
                        radius: 0.5
                        //enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        },
                        select: {
                            color: 'Blue',
                            radius: 0.5,
                            lineWidth: 4,
                            borderWidth: 30,
                            borderColor:'Blue'
                        }
                    },
                    enableMouseTracking: false
                }
            },

            series: series,

            exporting: {
                enabled: false
            }

        })
        return masterChart;
            ; // return chart instance
    }




}