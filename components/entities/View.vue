<template>
  <a-drawer
    placement="right"
    :closable="true"
    :width="width"
    :visible="visible"
    @close="onClose"
  >
    <div slot="title">
      <a-row type="flex" justify="center">
        <a-col :xs="24" :sm="24" :md="24" :lg="18" :xl="12">
          <a-breadcrumb v-if="entity.type != 'definition' && pathElems.length > 0">
            <a-breadcrumb-item v-for="(v, i) in pathElems" :key="i">{{ v }}</a-breadcrumb-item>
          </a-breadcrumb>
          <h1>
            <span>{{ entity.title }}</span>
            <a @click="metaVisible=true" class="entity-meta-icon" v-if="!metaVisible">
              <a-icon type="menu" title="Meta"/>
            </a>
          </h1>
          <a :href="entity.data.home_addr">{{ entity.data.home_addr }}</a>
        </a-col>
      </a-row>
    </div>
    <a-row type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="24" :lg="18" :xl="12">
        <component v-bind:is="components[entity.type]" :data="entity.data"></component>
        <div v-if="entity.type != 'definition' && entity.data.topics != null && entity.data.topics.length > 0">
          <a-tag v-for="(t, i) in entity.data.topics" :key="i">{{t}}</a-tag>
        </div>
        <template v-if="entity.type == 'definition' && entity.data.relations != null">
          <div v-for="(r, i) in entity.data.relations" :key="i">
            <a-card class="definition-card">
              <span slot="title"><a-icon :type="r.icon"/> {{r.title}}</span>
              <component  v-bind:is="components['definition-rel']" :data="r"></component>
            </a-card>
          </div>
        </template>
        <template v-if="auth != null">
          <a-divider />
          <a-row>
            <a-col span="12"><h3>In my collections:</h3></a-col>
            <a-col span="12">
              <a-button type="primary" icon="plus" style="float: right" @click="selectCollection" v-if="!this.selectCollectionModal" :loading="loading">
                Add to collection
              </a-button>
            </a-col>
          </a-row>
          <a-tag v-for="(c, i) in entity.collections" :key="i" closable @close="removeFromCollection(c.id)" class="collection-tag"><a-icon type="lock" v-if="c.private" /> <a @click="loadCollection(c.token)">{{c.name}}</a><a-divider type="vertical" /></a-tag>
          <span v-if="entity.collections == null || entity.collections.length==0">None</span>
        </template>
        <a-divider />
      </a-col>
    </a-row>
    <a-modal v-model="selectCollectionModal"  :footer="null" :bodyStyle="{paddingTop:0}">
      <span slot="title">
        <a-button type="primary" icon="plus" @click="showCreateCollectionForm">
        New collection
      </a-button>
      </span>
      <a-list item-layout="horizontal" size="small" :loading="loading">
        <a-list-item v-for="(c, i) in collections" :key="i" @click="addToCollection(c.id)">
          <a-tag v-if="c.isNew"  color="purple">NEW</a-tag> <a>{{c.name}}</a><a-tag v-if="c.private" style="float:right" color="green"><a-icon type="lock" /> Private</a-tag>
        </a-list-item>
      </a-list>
    </a-modal>
    <a-modal v-model="createFormModal">
      <CreateForm ref="createForm" />
      <template slot="footer">
        <a-button key="back" @click="handleCancelCreateCollection">
          Cancel
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleCreateCollection">
          Create
        </a-button>
      </template>
    </a-modal>
    <a-drawer
      title="Meta"
      :width="450"
      :closable="true"
      :visible="metaVisible"
      @close="onCloseMeta"
    >
      <a-descriptions layout="horizontal" :column="1">
        <a-descriptions-item label="Source">
          <a :href="dataViewAddr" target="_blank"> {{ dataFilename }}</a>
        </a-descriptions-item>
        <a-descriptions-item label="Added">
          {{ createdAt() }}
        </a-descriptions-item>
        <a-descriptions-item label="Updated">
          {{ updatedAt() }}
        </a-descriptions-item>
        <a-descriptions-item>
          <a :href="dataEditAddr" target="_blank"><a-icon type="edit" title="Edit this"/> Edit</a>
          <a-divider type="vertical"/>
          <a :href="dataCommitsAddr" target="_blank"><a-icon type="bars" title="View"/> Commits</a>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </a-drawer>
</template>

<script>
    import moment from 'moment'
    import Vue from 'vue'
    import GenericType from "@/components/data-types/Generic";
    import BookType from "@/components/data-types/Book";
    import PersonType from "@/components/data-types/Person";
    import ConferenceType from "@/components/data-types/Conference";
    import SoftwareType from "@/components/data-types/Software";
    import DefinitionType from "@/components/data-types/Definition";
    import DefinitionRelType from "@/components/data-types/DefinitionRel";
    import CreateForm from "@/components/collections/CreateForm";


    const repoAddr = "https://github.com/refto/data/"
    const dateFormat = "HH:mm, MMMM Do, YYYY"
    const defaultWidth = '100%'

    export default {
        props: ['entity_id'],
        data() {
            return {
                visible: false,
                metaVisible: false,
                entity: {
                    id: 0,
                    title: "",
                    data: {},
                    type: "",
                    token: "",
                    collections: [],
                },
                loading: false,
                components: {
                    '': GenericType,
                    'generic': GenericType,
                    'book': BookType,
                    'person': PersonType,
                    'conference': ConferenceType,
                    'software': SoftwareType,
                    'definition': DefinitionType,
                    'definition-rel': DefinitionRelType,
                },
                pathElems: [],
                auth: null,
                selectCollectionModal: false,
                addEntityToCollection: 0,
                collections: [],
                dataFilename: "",
                dataEditAddr: "",
                dataViewAddr: "",
                dataCommitsAddr: "",
                repoAddr: repoAddr,
                width: defaultWidth,
                createFormModal: false,
            };
        },

        components: {
            GenericType,
            BookType,
            PersonType,
            ConferenceType,
            SoftwareType,
            DefinitionType,
            DefinitionRelType,
            CreateForm
        },

        beforeMount() {
            if (this.$store.state.auth !== null) {
                this.auth = this.$store.state.auth
            }
        },


        mounted() {
            if (this.entity_id > 0) {
                this.loadEntity(this.entity_id)
                this.visible = true
            }
        },

        methods: {
            loadEntity(id) {
                this.error = ""
                this.loading = true

                try {
                    this.$axios.$get("/entities/" + id + "/").then((resp) => {
                        this.entity = resp
                        let pathElems = this.entity.token.split("/")
                        pathElems.pop()
                        pathElems.push("")
                        this.pathElems = pathElems
                        this.dataFilename = this.getDataFilename()
                        this.dataViewAddr = repoAddr + "blob/master/" + this.dataFilename
                        this.dataEditAddr = repoAddr + "edit/master/" + this.dataFilename
                        this.dataCommitsAddr = repoAddr + "commits/master/" + this.dataFilename
                    })
                } catch (e) {}
                this.loading = false
            },
            loadCollections(name) {
                this.loading = true

                try {
                    let path = '/collections/?entity_id='+this.entity.id+'&available=true'
                    if (name && name != "") {
                        path += "&name=" + name
                    }
                    this.$axios.$get(path).then((resp) => {
                        this.collections = []
                        if (resp.data != null) {
                            this.collections = resp.data
                        }
                    })
                } catch (e) {}
                this.loading = false
            },
            addToCollection(collectionID) {
                this.loading = true
                this.selectCollectionModal = false

                let path = '/collections/' + collectionID + '/entities/' + this.entity.id + '/'
                this.$axios.$post(path).then((resp) => {
                    this.$message.success('Added to collection')
                    this.loadEntity(this.entity.id)
                })
                this.loading = false
            },
            removeFromCollection(collectionID) {
                this.loading = true

                let path = '/collections/' + collectionID + '/entities/' + this.entity.id + '/'
                this.$axios.$delete(path).then((resp) => {
                    this.$message.success('Removed from collection')
                    this.loadEntity(this.entity.id)
                })
                this.loading = false
            },
            onClose() {
                this.visible = false;
            },
            onCloseMeta() {
                this.metaVisible = false;
            },
            selectCollection() {
                this.addEntityToCollection = 0
                this.selectCollectionModal = true
                this.loadCollections()
            },
            loadCollection(token) {
                this.visible = false
                Vue.nextTick(() => {
                    this.$router.push({
                        path: '/#c:' + token
                    })
                })

            },
            getDataFilename() {
                let t = ""
                let token = this.entity.token
                if (this.entity.type !== "") {
                    t = "." + this.entity.type
                }
                if (token.startsWith("/")) {
                    token = token.slice(1)
                }

                return token + t + ".yaml"
            },
            createdAt() {
                return moment(this.entity.created_at).format(dateFormat)
            },
            updatedAt() {
                if (this.entity.updated_at == null) {
                    return 'Never'
                }
                return moment(this.entity.updated_at).format(dateFormat)
            },
            showCreateCollectionForm() {
                this.createFormModal = true
                Vue.nextTick(() => {
                    this.$refs.createForm.$refs.name.focus();
                })
            },
            handleCreateCollection() {
                const form = this.$refs.createForm.form;
                form.validateFields((err, values) => {
                    if (err) {
                        return;
                    }

                    this.error = ""
                    this.loading = true

                    // TODO
                    // can't find how to make form value of type bool
                    // so should cast it here :(
                    values.private = values.private === "true"

                    this.$axios.$request({method: "POST", url: "/collections/", data: values}).then((resp) =>  {
                        // TODO instead of reload it is more convenient to add newly created collection to
                        // "new collections" section
                        // because if user browsing collections not on first or last page
                        // he will not see newly created collection
                        resp.isNew = true
                        this.collections.unshift(resp)
                    })
                    this.loading = false
                    form.resetFields();
                    this.createFormModal = false
                })

            },
            handleCancelCreateCollection() {
                this.createFormModal = false
            },
        },

        watch: {
            entity_id: function (id) {
                if (id > 0) {
                    // add entityID to path
                    history.pushState({}, null, window.location.href + "#e:" + id)
                    if (this.entity.id != id) {
                      this.loadEntity(id)
                    }
                    this.visible = true
                } else {
                    this.visible = false
                }
            },
            visible: function (val) {
              if (!val) {
                  let newPathFrags = window.location.href.split("#")
                  newPathFrags.pop()
                  let newPath = newPathFrags.join("#")
                  history.pushState({}, null, newPath)
                  this.$emit("setEntityID", 0)
              }
            }
        },

        computed: {
            description: function () {
                if (this.entity.data != undefined && this.entity.data.description != undefined) {
                    return this.entity.data.description
                }

                return ""
            }
        }
    }
</script>

<style>
.ant-breadcrumb span{
  text-transform: capitalize;
}
.collection-tag {
  font-size: 16px;
  padding: 5px 10px;
}
.collection-tag a {
  text-decoration: underline;
  color: dodgerblue;
}
.entity-meta-icon{
  float: right;
  font-size: 20px;
}
.ant-tag {
  margin-top: 7px;
}

</style>
