import { AutoComplete, Button, Divider, Form, Input, InputNumber } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCollectionContext } from "../../modules/CollectionContext";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

export function ImageForm({ image, onSaveChanges }) {
  const { artistOptions } = useCollectionContext();
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(image);
  }, [image, form]);

  const onFinish = useCallback(
    (values: any) => {
      onSaveChanges &&
        onSaveChanges({
          ...image,
          ...values,
        });
    },
    [onSaveChanges]
  );

  const onAuthorSelect = useCallback(
    (value, option) => {
      form.setFieldValue("artistImg", option.artistImg);
    },
    [form]
  );

  const onImageChange = useCallback(
    ({ target: { value } }) => {
      if (value) {
        const valueArr = value.split(".");
        const maxIndex =
          valueArr.length - 2 > 0 ? valueArr.length - 2 : valueArr.length - 1;
        valueArr[maxIndex] += "-small";
        value = valueArr.join(".");
      }
      form.setFieldValue("smallImage", value);
    },
    [form]
  );

  const onAddTag = useCallback(() => {
    const tags = form.getFieldValue("tags") || [];
    tags.push("");
    form.setFieldsValue("tags", tags);
  }, [form]);

  const onSearch = useCallback((option) => {

  }, []);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="image"
      onFinish={onFinish}
      initialValues={image}
      style={{ maxWidth: 900, marginTop: 40 }}
      scrollToFirstError
    >
      <Form.Item
        label="ID / Collection / Title"
        tooltip="Image title "
      >
        <Input.Group compact>
          <Form.Item name="id" noStyle>
            <Input
              style={{ width: "20%" }}
              placeholder="Image id"
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            name="collection"
            noStyle
            rules={[{ required: true, message: "Collection Name is required" }]}
          >
            <Input
              style={{ width: "30%" }}
              placeholder="Collection Name"
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            name="title"
            noStyle
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Input title" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item
        label="Subtitle / Internal Id / Token Id"
      >
        <Input.Group compact>
          <Form.Item name="subtitle" noStyle>
            <Input style={{ width: "40%" }} placeholder="Subtitle" />
          </Form.Item>
          <Form.Item
            name="internalNumber"
            noStyle
            rules={[{ required: true, message: "Internal number" }]}
          >
            <Input style={{ width: "30%" }} placeholder="Internal id" />
          </Form.Item>
          <Form.Item name="tokenId" noStyle>
            <Input style={{ width: "30%" }} placeholder="Token Id" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label="Artist">
        <Input.Group compact>
          <Form.Item
            name="artist"
            noStyle
            rules={[{ required: true, message: "Artist name is required" }]}
          >
            <AutoComplete
              options={artistOptions}
              onSelect={onAuthorSelect}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              style={{ width: "50%" }}
              placeholder="Artist Name"
            >
              <Input />
            </AutoComplete>
          </Form.Item>
          <Form.Item
            name="artistImg"
            noStyle
            rules={[{ required: true, message: "Artist image is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Artist Image" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label="Camera / Manufacturer / Tone">
        <Input.Group compact>
          <Form.Item
            name="camera"
            noStyle
            rules={[{ required: true, message: "Camera" }]}
          >
            <Input style={{ width: "33%" }} placeholder="Camera" />
          </Form.Item>
          <Form.Item
            name="cameraManufacturer"
            noStyle
            rules={[{ required: true, message: "Camera Manufacture" }]}
          >
            <Input style={{ width: "33%" }} placeholder="Camera Manufacturer" />
          </Form.Item>
          <Form.Item name="tone" noStyle>
            <Input style={{ width: "33%" }} placeholder="Tone" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label="License / Country">
        <Input.Group compact>
          <Form.Item name="license" noStyle>
            <Input style={{ width: "33%" }} placeholder="License" />
          </Form.Item>
          <Form.Item name="country" noStyle>
            <Input style={{ width: "33%" }} placeholder="Country" />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Image">
        <Input.Group compact>
          <Form.Item name="image" noStyle>
            <Input
              style={{ width: "100%" }}
              placeholder="Image"
              onChange={onImageChange}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Small Image">
        <Form.Item name="smallImage" noStyle>
          <Input
            style={{ width: "100%" }}
            placeholder="Small image"
            disabled={true}
          />
        </Form.Item>
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea showCount />
      </Form.Item>
      <Form.List name="tags">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={`Tags ${index}`}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message:
                        "Please input passenger's name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="passenger name"
                    style={{ width: "60%" }}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
          </>
        )}
      </Form.List>
      <Form.Item name=" " label=" ">
        <Button type="dashed" onClick={onAddTag} style={{ width: "60%" }}>
          <PlusOutlined /> Add Tag
        </Button>
      </Form.Item>
      <Divider />
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Save Form Data
        </Button>
      </Form.Item>
    </Form>
  );
}
