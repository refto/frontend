<template>
  <a-form layout='vertical' :form="form">
    <a-form-item label='Name'>
      <a-input type="hidden" v-decorator="['id']"/>
      <a-input ref="name"
        v-decorator="[
              'name',
              {
                rules: [{ required: true, message: 'Please input the name of collection!' }],
              }
            ]"
      />
    </a-form-item>
    <a-form-item class='collection-create-form_last-form-item'>
      <a-radio-group
        v-decorator="[
              'private',
              {
                initialValue: 'true',
              }
            ]"
      >
        <a-radio value="false">Public</a-radio>
        <a-radio value="true"><a-icon type="lock" /> Private</a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
    export default {
        props: ['edit'],
        data() {
            return {
                form: this.$form.createForm(this, { name: 'create-collection' }),
            };
        },
    }
</script>

<style>
</style>
