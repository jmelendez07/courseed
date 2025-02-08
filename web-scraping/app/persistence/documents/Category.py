from mongoengine import Document, StringField

class Category(Document):
    name = StringField(required=True)

    meta = {
        "collection": "categories"
    }