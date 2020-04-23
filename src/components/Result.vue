<template>
  <el-dialog
    :visible="visible"
    @close="$emit('update:visible', false)"
    width="50%"
    class="c-Result"
    :append-to-body="true"
  >
    <div class="dialog-title" slot="title">
      <span :style="{ fontSize: '18px' }">
        摇号结果
      </span>
      <span :style="{ fontSize: '14px', color: '#999', marginLeft: '10px' }">
        (点击号码可以删除)
      </span>
      
         <el-button size="mini" type="primary" @click="exportToExcel">导出</el-button>
      
    </div>
    <div
      v-for="(item, index) in resultList"
      :key="index"
      class="listrow"
      @click="
        event => {
          deleteRes(event, item);
        }
      "
    >
      <span class="name">
        {{ item.name }}
      </span>
      <span class="value">
        <span
          class="card"
          v-for="(data, j) in item.value"
          :key="j"
          :data-res="data"
        >
          {{data.key}}
          {{data.name?protectionName(data.name):""}}
          {{data.id?data.id:""}}
        </span>
      </span>
    </div>
  </el-dialog>
</template>
<script>
import { conversionCategoryName, getDomData } from '@/helper/index';
export default {
  name: 'c-Result',
  props: {
    visible: Boolean
  },
  computed: {
    list: {
      get() {
        return this.$store.state.list;
      }
    },
    result: {
      get() {
        return this.$store.state.result;
      },
      set(val) {
        this.$store.commit('setResult', val);
      }
    },
    resultList() {
      const allList = this.list;
      const list = [];
      const eleList = [];
      for (const key in this.result) {
        if (this.result.hasOwnProperty(key)) {
          var element = this.result[key];
          if(element.length > 0) {
            for (const i in element) {
              const arrIndex = allList.findIndex(item => item.key === element[i])
              if (arrIndex > -1) {
                eleList.push(allList[arrIndex]);
              } else {
                eleList.push({key: element[i]});
              }       
            }
            element = eleList;
          }
          let name = conversionCategoryName(key);
          list.push({
            label: key,
            name,
            value: element
          });
        }
      }
      console.log(list);
      return list;
    }
  },
  methods: {
    exportToExcel() {
        //excel数据导出
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('../assets/js/Export2Excel');
          const tHeader = ['序号','姓名', 'ID'];
          const filterVal = ['key','name', 'id'];
          const list = this.resultList[0].value;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '摇号结果');
         });
      this.$message({
        message: '导出成功',
        type: 'success'
      });
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    protectionName(name) {
        return [...name]
          .map((item, index, arr) => {
          return Math.floor(arr.length / 2) === index ? '*' : item;
        })
        .join('');
    },
    deleteRes(event, row) {
      const Index = getDomData(event.target, 'res');
      if (!Index) {
        return;
      }
      this.$confirm('此操作将移除该中奖号码，确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Index) {
            const result = this.result;
            result[row.label] = this.result[row.label].filter(
              item => item !== Number(Index)
            );
            this.result = result;
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  }
};
</script>
<style lang="scss">
.c-Result {
  .el-dialog__body {
    max-height: 60%;
    overflow-y: auto;
  }
  .listrow {
    display: flex;
    line-height: 30px;
    .name {
      width: 80px;
      font-weight: bold;
    }
    .value {
      flex: 1;
    }
    .card {
      display: inline-block;
      width: 120px;
      padding: 0 5px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      border-radius: 4px;
      border: 1px solid #ccc;
      background-color: #f2f2f2;
      margin-left: 5px;
      margin-bottom: 5px;
      position: relative;
      cursor: pointer;
      &:hover {
        &::before {
          content: '删除';
          width: 100%;
          height: 100%;
          background-color: #ccc;
          position: absolute;
          left: 0;
          top: 0;
          color: red;
        }
      }
    }
  }
}
</style>
