from mongoengine import Document, StringField, FloatField, IntField

class Course(Document):
    url = StringField(required=True, unique=True)
    title = StringField(required=True)
    image = StringField()
    originalImage = StringField()
    description = StringField()
    price = FloatField()
    duration = IntField()
    modality = StringField()
    type = StringField()
    categoryId = StringField(required=True)
    institutionId = StringField(required=True)

    meta = {
        "collection": "courses"
    }