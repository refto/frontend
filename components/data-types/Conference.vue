<template>
  <div>
    <a-avatar v-if="data.picture_addr != null" shape="square" :src="data.picture_addr" />
    <p><a-icon type="environment" /> {{data.location}}<br/>
    <a-icon type="calendar" /> {{dateAt(data.start_dt, data.end_dt)}}<br/>
      <span v-if="isValidDate(data.start_dt)" :class="dateDiffClass(data.start_dt)"><a-icon type="flag" /> {{dateDiffFromNow(data.start_dt)}}</span></p>
    <p v-html="data.description"></p>
    <ul v-if="data.links != null && data.links.length > 0" class="data-links">
      <li v-for="l in data.links"><a-icon :type="l.icon == null ? 'link' : l.icon" /> <a :href="l.addr" target="_blank">{{l.label}}</a></li>
    </ul>
  </div>
</template>

<script>
    import moment from 'moment'

    export default {
        props: ['data'],
        methods: {
            dateAt(startDT, endDT) {
                let startAt = moment(startDT)
                let endAt = moment(endDT)

                // not valid dates, return as is
                if (!startAt.isValid() || !endAt.isValid()) {
                    let retval = startDT
                    if (endDT != null) {
                        retval += " - " + endDT
                    }
                    return retval
                }

                let format = 'MMMM Do'

                // add year to format if not current year
                if (startAt.diff(moment(), "years") !== 0) {
                    format += " YYYY"
                }

                format += ", hh:mm"

                // display only hours from end date if it is same day event
                if (startAt.diff(endAt, "days") === 0) {
                  return startAt.format(format) + " - " + endAt.format("hh:ss")
                }

                return startAt.format(format) + " - " + endAt.format(format)
            },
            dateDiffFromNow(startDT) {
                let startAt = moment(startDT)

                return startAt.fromNow()
            },
            dateDiffClass : function (d) {
                if (moment().isAfter(d)) {
                    return 'text-red'
                }
                return 'text-green'
            },
            isValidDate : function (d) {
               return moment(d).isValid()
            }
        },
    }
</script>

<style>
  .text-red {
    color: #c90008;
  }
  .text-green {
    color: #009727;
  }

</style>

