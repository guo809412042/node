const sequelize = require('../common/sequelize');
const Sequelize = require('sequelize');
const moment = require('moment');

const IssueTagRecord = sequelize.define(
  'issue_tag_record',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    source_id: {
      type: Sequelize.STRING,
    },
    source_type: {
      type: Sequelize.SMALLINT,
      comment: '0.工单; 1.GP 回复 id; 2.App Store回复 id; 3.邮件',
    },
    tag_id: {
      type: Sequelize.INTEGER,
    },
    country: {
      type: Sequelize.STRING,
    },
    lang: {
      type: Sequelize.STRING,
    },
    is_vip: {
      type: Sequelize.TINYINT,
    },
    product_id: {
      type: Sequelize.SMALLINT,
    },
    source_create_time: {
      type: Sequelize.DATE,
      get () {
        return moment(this.getDataValue('source_create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    source_finish_time: {
      type: Sequelize.DATE,
      get () {
        return moment(this.getDataValue('source_finish_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    create_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    modify_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    tag_remark: {
      type: Sequelize.CHAR,
    },
  },
  { timestamps: false, freezeTableName: true, tableName: 'issue_tag_record', }
);

const IssueKnowledge = sequelize.define(
  'issue_knowledge',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    keywords: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    comment: {
      type: Sequelize.TEXT,
      defaultValue: '',
      allowNull: false,
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    modify_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    is_delete: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'issue_knowledge',
  }
);

const IssueKnowledgeTag = sequelize.define(
  'issue_knowledge_tag',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    parent_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    modify_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'issue_knowledge_tag',
  }
);

const IssueKnowledgeLog = sequelize.define(
  'issue_knowledge_log',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    issue_knowledge_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    operator_id: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    type: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'issue_knowledge_log',
  }
);

const IssueUserSearch = sequelize.define(
  'issue_user_search',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    source_type: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get () {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    modify_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get () {
        return moment(this.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    staus: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'issue_user_search',
  }
);

const FapiaoInvoice = sequelize.define(
  'fapiao_invoice',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    auid: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    platform: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
      defaultValue: '1',
    },
    order_id: {
      type: Sequelize.STRING(512),
      allowNull: false,
      defaultValue: '',
    },
    order_channel: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    order_type: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    amount: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    order_img: {
      type: Sequelize.STRING(128),
      allowNull: false,
      defaultValue: '',
    },
    email: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
    title: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    tax_number: {
      type: Sequelize.CHAR(32),
      allowNull: false,
      defaultValue: '',
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    telphone: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    bank_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    bank_number: {
      type: Sequelize.STRING(128),
      allowNull: false,
      defaultValue: '',
    },
    remark: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    product_id: {
      type: Sequelize.INTEGER(4),
      allowNull: true,
      defaultValue: '2',
    },
    status: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
      defaultValue: '1',
    },
    ctime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get () {
        return moment(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    mtime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      get () {
        return moment(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'fapiao_invoice',
  }
);

const TipOffTagRecord = sequelize.define(
  'issue_tipoff_tag',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    store_type: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 1,
    },
    name: {
      type: Sequelize.STRING(),
      allowNull: false,
      defaultValue: '',
    },
    report_type: {
      type: Sequelize.STRING(),
      allowNull: false,
      defaultValue: '',
    },
    c_user_id: {
      type: Sequelize.STRING(),
      allowNull: false,
      defaultValue: '',
    },
    m_user_id: {
      type: Sequelize.STRING(),
      allowNull: false,
      defaultValue: '',
    },
    invalid: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 1,
    },
    ctime: {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    mtime: {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: 'issue_tipoff_tag',
  }
);

const ghAutoRequirement = sequelize.define(
  'gh_auto_requirement',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ctime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    mtime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('mtime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    c_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    m_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    invalid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { timestamps: false, freezeTableName: true, tableName: 'gh_auto_requirement', }
);

const ghAutoRequirementRelSql = sequelize.define(
  'gh_auto_requirement_rel_sql',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    requirement_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    module_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    module_detail_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    module_detail_ads: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    base_sql: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    query_schema: {
      type: Sequelize.STRING,
      get () {
        let val = null;
        const str = this.getDataValue('query_schema');
        if (str) {
          try {
            val = JSON.parse(str);
          } catch (e) {}
        }
        return val;
      },
    },
    resp_schema: {
      type: Sequelize.STRING,
      allowNull: false,
      get () {
        let val = null;
        const str = this.getDataValue('resp_schema');
        if (str) {
          try {
            val = JSON.parse(str);
          } catch (e) {}
        }
        return val;
      },
    },
    ctime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    mtime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('mtime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    c_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    m_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    invalid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { timestamps: false, freezeTableName: true, tableName: 'gh_auto_requirement_rel_sql', }
);

const ghAutoRequirementRelModule = sequelize.define(
  'gh_auto_requirement_rel_module',
  {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.UUIDV4,
    },
    requirement_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
    },
    default_query: {
      type: Sequelize.STRING,
      get () {
        let val = null;
        const str = this.getDataValue('default_query');
        if (str) {
          try {
            val = JSON.parse(str);
          } catch (e) {}
        }
        return val;
      },
    },
    component_schema: {
      type: Sequelize.STRING,
      allowNull: false,
      get () {
        let val = null;
        const str = this.getDataValue('component_schema');
        if (str) {
          try {
            val = JSON.parse(str);
          } catch (e) {}
        }
        return val;
      },
    },
    ctime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    mtime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get () {
        return moment(this.getDataValue('mtime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    c_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    m_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    invalid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { timestamps: false, freezeTableName: true, tableName: 'gh_auto_requirement_rel_module', }
);

module.exports = {
  IssueTagRecord,
  IssueKnowledge,
  IssueKnowledgeTag,
  IssueKnowledgeLog,
  IssueUserSearch,
  FapiaoInvoice,
  TipOffTagRecord,
  ghAutoRequirement,
  ghAutoRequirementRelSql,
  ghAutoRequirementRelModule,
};
