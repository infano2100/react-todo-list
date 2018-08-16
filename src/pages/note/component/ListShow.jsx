import React, { Component } from 'react'
import { List, Icon, Popconfirm, message, Spin, Modal } from 'antd'
import FormAdd from './FormAdd'
import { DB_CONFIG } from '../config'
import firebase from 'firebase'

export class ListShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: [],
      visible: false,
      dataId: null,
      dataNote: ''
    }

    this.app = firebase.initializeApp(DB_CONFIG)
    this.database = this.app
      .database()
      .ref()
      .child('notes')

    this.addNote = this.addNote.bind(this)
    this.removeNote = this.removeNote.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.editNote = this.editNote.bind(this)
  }

  componentWillMount() {
    const previousNotes = this.state.notes

    // DataSnapshot
    this.database.on('child_added', snap => {
      previousNotes.push({
        id: snap.key,
        noteContent: snap.val().noteContent
      })

      this.setState({
        notes: previousNotes
      })
    })

    // get one
    // this.database
    //   .child('-LJ4tkc6Ioya9KEvpluI')
    //   .once('value')
    //   .then(function(snap) {
    //     console.log(snap.val())
    //   })
    // get one

    this.database.on('child_removed', snap => {
      for (var i = 0; i < previousNotes.length; i++) {
        if (previousNotes[i].id === snap.key) {
          previousNotes.splice(i, 1)
        }
      }

      this.setState({
        notes: previousNotes
      })
    })

    this.database.on('child_changed', snap => {
      for (var i = 0; i < previousNotes.length; i++) {
        if (previousNotes[i].id === snap.key) {
          previousNotes[i].noteContent = snap.val().noteContent
        }
      }

      this.setState({
        notes: previousNotes
      })
    })
  }

  async addNote(note) {
    await this.database.push().set({ noteContent: note })
    await this.setState({
      visible: false
    })
    await message.success('Add Note Success')
  }

  async editNote(data) {
    if (data) {
      this.setState({
        visible: false,
        dataId: null,
        dataNote: ''
      })
    }
    var update = firebase.database().ref('notes/' + this.state.dataId)
    await update
      .update({ noteContent: data })
      .then(() => {
        message.success('Edit Note Success')
      })
      .catch(error => {
        // handle the error however you like
        console.error(error)
      })
  }

  removeNote(noteId) {
    this.database.child(noteId).remove()
    message.success('Delete Note Success')
  }

  showModal() {
    this.setState({
      visible: true
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      dataId: null,
      dataNote: ''
    })
  }

  onEdit(id, note) {
    this.setState({
      visible: true,
      dataId: id,
      dataNote: note
    })
  }

  render() {
    const data = this.state.notes
    const { dataId, dataNote } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 16 }}>Note</h1>
        <div style={{ textAlign: 'right' }}>
          <Icon
            onClick={this.showModal}
            style={{ fontSize: 25, fontWeight: 'bold', color: '#1890ff' }}
            type="plus"
          />
        </div>
        {data.length > 0 ? (
          <List
            style={{ textAlign: 'left' }}
            className="demo-loadmore-list"
            // loading={loading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={data}
            renderItem={item => (
              <List.Item
                actions={[
                  <a onClick={() => this.onEdit(item.id, item.noteContent)}>
                    <Icon type="edit" />
                  </a>,
                  <Popconfirm
                    placement="leftTop"
                    title="Are you sure delete this Note?"
                    onConfirm={() => this.removeNote(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Icon style={{ color: 'red' }} type="delete" />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta title={item.noteContent} />
              </List.Item>
            )}
          />
        ) : (
          <Spin />
        )}

        <Modal
          title={dataId ? 'Edit Note' : 'Add Note'}
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <FormAdd
            dataNote={dataNote}
            submitForm={dataId ? this.editNote : this.addNote}
          />
        </Modal>
      </div>
    )
  }
}

export default ListShow
