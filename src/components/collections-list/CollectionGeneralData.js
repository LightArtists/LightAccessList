import {AutoComplete, Button, Checkbox, Form, Input, InputNumber, Switch} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { MinusCircleOutlined } from "@ant-design/icons";

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

export function CollectionGeneralData({
  collection,
  onSaveChanges,
  categoryOptions,
}) {
  const [form] = Form.useForm();
  const [categoryType, setCategoryType] = useState();

  useEffect(() => {
    setCategoryType(collection?.categoryType || "");
  }, [collection]);

  const onFinish = useCallback(
    (values: any) => {
      console.log("Received values of form: ", values);
      if (categoryType) {
        values.categoryType = categoryType;
      } else {
        values.categoryType = values.categoryName
          .toLowerCase()
          .replace(/\s/gm, "_");
      }
      onSaveChanges &&
        onSaveChanges({
          ...collection,
          ...values,
        });
    },
    [onSaveChanges, categoryType]
  );

  const onCategorySelect = useCallback(
    (value, option: any) => {
      setCategoryType(option.type);
    },
    [setCategoryType]
  );

  const onSearch = useCallback(
    (option: any) => {
      setCategoryType("");
    },
    [setCategoryType]
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={collection}
      style={{ maxWidth: 900 }}
      scrollToFirstError
    >
      <Form.Item label="Name" tooltip="Collection Name">
        <Input.Group compact>
          <Form.Item
            name="name"
            noStyle
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Input name" />
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

      <Form.Item label="Category">
        <Form.Item
          name="categoryName"
          noStyle
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <AutoComplete
            options={categoryOptions}
            onSelect={onCategorySelect}
            onSearch={onSearch}
            style={{ width: "100%" }}
            placeholder="Category Name"
          >
            <Input />
          </AutoComplete>
        </Form.Item>
      </Form.Item>

      <Form.Item label="Drop ID / Path / Collection ID">
        <Input.Group compact>
          <Form.Item
            name="dropId"
            noStyle
            rules={[{ required: true, message: "Drop id is required" }]}
          >
            <Input style={{ width: "20%" }} placeholder="Drop id" />
          </Form.Item>
          <Form.Item
            name="path"
            noStyle
            rules={[{ required: true, message: "Collection url required" }]}
          >
            <Input
              style={{ width: "40%" }}
              placeholder="Collection Path (/alpha) id"
            />
          </Form.Item>
          <Form.Item name="collectionID" noStyle>
            <Input
              style={{ width: "40%" }}
              placeholder="Unique Collection Slug"
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label=" ">
        <Input.Group >
          <Form.Item
            label="Main"
            valuePropName="checked"
            name="isMain"
            wrapperCol={{ offset: 8, span: 16 }}
            noStyle
          >
            <Checkbox style={{ width: "40%" }}>Main Collection</Checkbox>
          </Form.Item>
          <Form.Item
            label="Random Mint"
            valuePropName="checked"
            name="isRandom"
            noStyle
          >
            <Checkbox style={{ width: "40%" }}>Random</Checkbox>
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label="Author / Authors Count">
        <Input.Group compact>
          <Form.Item name="author" noStyle>
            <Input style={{ width: "70%" }} placeholder="Authors name" />
          </Form.Item>
          <Form.Item
            name="artists"
            noStyle
            rules={[{ required: true, message: "Category type is required" }]}
          >
            <InputNumber
              style={{ width: "30%" }}
              min={1}
              max={5000}
              defaultValue={30}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name="aboutCollection" label="Small Description">
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea showCount />
      </Form.Item>
      <Form.List name="tags">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? "Tags" : ""}
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
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
}
