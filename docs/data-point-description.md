# Datapoint Mapping


| Data point id | type | Description | read-only/read-write |
| ------------- | ---- | ----------- | -----------|
| 1  | boolean | Device is powered on (true).Device is powered off (false). | rw |  
| 2 | number | desied temperature. Factor 10 (Value 215 = 21.5°C) | rw |
| 3 | number | actual temperature. Factor 10 | ro |
| 4 | string | mode: (Manual,Program,Holiday) | rw |
| 6 | boolean | childlock | rw |
| 12 | number | ? | ? |
| 101 | boolean | ? | ? |
| 102 | boolean | heating relay active | ro |
| 103 | number | ? | ? |
| 104 | number | number of days in holiday | rw |
| 105 | number | desired temperatur while holiday mode is active | rw |
| 106 | boolean | ? | ? |
| 107 | boolean | ? | ? |
| 108 | boolean | ? | ? |
| 109 | number | compensation actual temperature | rw |
| 110 | number | temperature difference before heating relay will switch value (hysteresis / ger: Hysterese) | rw |
| 111 | number | hysteresis extern | rw |
| 112 | number | Limit Temp High | rw |
| 113 | number | low temp limit | rw |
| 114 | number | set_temp_max | rw |
| 115 | number | set_temp_low | rw |
| 116 | string | type of sensor to use (only internal is working) (in = internal; ext = external; all = internal & external) | rw |
| 117 | string | state on power on (on = power on; off = power off, keep = last state ) | rw |
| 118 | string | program type (2days = 5+2, 1day = 6+1, 0days = 7) | rw |


## more options as mention in the manual
- Helligkeit in Standby ?? (0: Aus, 1: Schwach, 2: Halbhell) => evtl. 12
- entkalkungsfunction => 101, 106, 107, 108 ?
- Fensterfunction = angeblich nen Int wert?
- Fensterfunktion für Temperaturauslösung => könnte zwei dps haben (an/aus und ein Zahlenwert)
- wifi connection!?
- connection to cloud?