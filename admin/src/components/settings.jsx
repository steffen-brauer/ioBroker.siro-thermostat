import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import I18n from '@iobroker/adapter-react/i18n';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import Button from '@material-ui/core/Button';

const CustomTableCell = ({ row, index, name, onChange }) => {
    const classes = styles();
    const { isEditMode } = row;
    return (
      //<TableCell align="left" className={classes.tableCell}>
         <TableCell align="left">
        {isEditMode ? (
            
          <Input
            value={row[name] || "" }
            name={name}
            onChange={e => onChange(e, index)}
           // className={classes.input}
          />
        ) : (
          row[name]
        )}
      </TableCell>
    );
  };


/**
 * @type {() => Record<string, import("@material-ui/core/styles/withStyles").CreateCSSProperties>}
 */
const styles = () => ({
    input: {
        marginTop: 0,
        minWidth: 400,
    },
    button: {
        marginRight: 20,
    },
    card: {
        maxWidth: 345,
        textAlign: 'center',
    },
    media: {
        height: 180,
    },
    column: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: 20,
    },
    columnLogo: {
        width: 350,
        marginRight: 0,
    },
    columnSettings: {
        width: 'calc(100% - 370px)',
    },
    controlElement: {
        //background: "#d2d2d2",
        marginBottom: 5,
    },
});


/**
 * @typedef {object} SettingsProps
 * @property {Record<string, string>} classes
 * @property {Record<string, any>} native
 * @property {(attr: string, value: any) => void} onChange
 */

/**
 * @typedef {object} SettingsState
 * @property {undefined} [dummy] Delete this and add your own state properties here
 */

/**
 * @extends {React.Component<SettingsProps, SettingsState>}
 */
class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.devices = JSON.parse(this.props.native['devices'] || '[]' ) 
        console.log(this.devices)
        this.state = {
            devices: this.devices
        }
 
    }

    /**
     * @param {AdminWord} title
     * @param {string} attr
     * @param {string} type
     */
    renderInput(title, attr, type) {
        return (
            <TextField
                label={I18n.t(title)}
                multiline={true}
                className={`${this.props.classes.input} ${this.props.classes.controlElement}`}
                value={this.props.native[attr]}
                type={type || 'text'}
                onChange={(e) => this.props.onChange(attr, e.target.value)}
                margin="normal"
            />
        );
    }

    /**
     * @param {AdminWord} title
     * @param {string} attr
     * @param {{ value: string; title: AdminWord }[]} options
     * @param {React.CSSProperties} [style]
     */
    renderSelect(title, attr, options, style) {
        return (
            <FormControl
                className={`${this.props.classes.input} ${this.props.classes.controlElement}`}
                style={{
                    paddingTop: 5,
                    ...style
                }}
            >
                <Select
                    value={this.props.native[attr] || '_'}
                    onChange={(e) => this.props.onChange(attr, e.target.value === '_' ? '' : e.target.value)}
                    input={<Input name={attr} id={attr + '-helper'} />}
                >
                    {options.map((item) => (
                        <MenuItem key={'key-' + item.value} value={item.value || '_'}>
                            {I18n.t(item.title)}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{I18n.t(title)}</FormHelperText>
            </FormControl>
        );
    }

    /**
     * @param {AdminWord} title
     * @param {string} attr
     * @param {React.CSSProperties} [style]
     */
    renderCheckbox(title, attr, style) {
        return (
            <FormControlLabel
                key={attr}
                style={{
                    paddingTop: 5,
                    ...style
                }}
                className={this.props.classes.controlElement}
                control={
                    <Checkbox
                        checked={this.props.native[attr]}
                        onChange={() => this.props.onChange(attr, !this.props.native[attr])}
                        color="primary"
                    />
                }
                label={I18n.t(title)}
            />
        );
    }


    renderTable(title,attr,style){
        return (
            <Table aria-label="caption table">
            <TableHead>
              <TableRow>
                <TableCell align="left">friendly name</TableCell>
                <TableCell align="left">device id</TableCell>
                <TableCell align="left">local key</TableCell>
                <TableCell align="left">version</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.devices.map((row, index) => (
                <TableRow key={index}>
                  <CustomTableCell {...{ row, index, name: "name", onChange: this.onChange }} />
                  <CustomTableCell {...{ row, index, name: "id", onChange:this.onChange }} />
                  <CustomTableCell {...{ row, index, name: "key", onChange:this.onChange }} />
                  <CustomTableCell {...{ row, index, name: "version", onChange:this.onChange }} />
                  <TableCell>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => this.onToggleEditMode(index)}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={() => this.onRevert(index)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <div><IconButton
                        aria-label="edit"
                        onClick={() => this.onToggleEditMode(index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                      aria-label="delete"
                      onClick={() => this.onDelete(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton></div>
                    )}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
    }

    onDelete(index){
      this.state.devices.splice(index,1)
      this.setState((state, props) => {
        return this.state.devices
      })
      this.setDeviceList(this.state.devices)
    }

    onRevert(index){
        let devices = this.getDeviceList()
        let row = devices[index]
        row = {...row, isEditMode:false}
        
        this.state.devices[index] = row
        
        this.setState((state, props) => {
            return {devices};
          });
      }

    onToggleEditMode(index) {
        var editMode
        const newRows =  this.state.devices.map((row,i) => {
            if (index == i) {
                editMode = !row.isEditMode
                return { ...row, isEditMode: !row.isEditMode };
            }
            return row;
        });
        
        console.log(newRows)
        this.setState((state, props) => {
            return {devices: newRows};
          });
        

        if (editMode == false){
            console.log('editmode off')
            this.setDeviceList(newRows)
        }
      }

    onChange(e, index) {
        const value = e.target.value;
        const name = e.target.name;
      
        console.log(e)
        const newRows = this.state.devices.map((row,i) => {
          if (index === i) {
            console.log('match')
            return { ...row, [name]: value };
          }
          return row;
        });
        this.setState((state, props) => {
            return {devices: newRows};
          });     
    };


    getDeviceList(){
        return JSON.parse(this.props.native['devices']);
        
    }

    setDeviceList(data){
        this.props.onChange('devices', JSON.stringify(data))
    }


    renderButton(value, func){
        return (
            <div>
            <Button variant="contained" onClick={func}>{value}</Button>
            </div>
        )
    }

    onAddEntry(){
        const row = {
            isEditMode:true,
            version: "3.3"
        }
        var devices = this.state.devices
        devices.push(row)
        this.setState((state, props) => {
            return {devices};
           });
    }

    render() {
        return (
            <form className={this.props.classes.tab}>
                {//this.renderInput('JSON Settings', 'option2', 'text') 
                }<br />
                {this.renderButton('Add new device', this.onAddEntry)}
                {this.renderTable('Devices','devices','text')
                }
            </form>
        );
    }
}

export default withStyles(styles)(Settings);