$.ajax
  url: 'http://query.yahooapis.com/v1/public/yql'
  data:
    q: "select * from weather.forecast where woeid = 2302408"
    format: 'json'
  dataType: 'json'
  crossDomain: true
  success: (data)->
    tempF = data.query.results.channel.item.condition.temp
    tempC = Math.round((tempF-32) * 50 / 9) / 10
    document.getElementById('temp').innerHTML = tempC