from mongoengine import Document, StringField

class Institution(Document):
    name = StringField(required=True)

    meta = {
        "collection": "institutions"
    }