"""Small generic CRUD router factory for integer-id content tables."""

from collections.abc import Callable
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select

from app.db import get_session


def crud_router(
    *,
    prefix: str,
    tag: str,
    model: type[SQLModel],
    create_model: type[SQLModel],
    order_by: Callable[[], list[Any]],
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=[tag])
    name = tag.rstrip("s")

    def get_or_404(session: Session, item_id: int) -> SQLModel:
        item = session.get(model, item_id)
        if item is None:
            raise HTTPException(404, f"{name} not found")
        return item

    @router.get("", response_model=list[model])
    def list_items(session: Session = Depends(get_session)):
        return session.exec(select(model).order_by(*order_by())).all()

    @router.get("/{item_id}", response_model=model)
    def get_item(item_id: int, session: Session = Depends(get_session)):
        return get_or_404(session, item_id)

    @router.post("", response_model=model, status_code=201)
    def create_item(data: create_model, session: Session = Depends(get_session)):  # type: ignore[valid-type]
        item = model.model_validate(data)
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

    @router.put("/{item_id}", response_model=model)
    def update_item(
        item_id: int,
        data: create_model,  # type: ignore[valid-type]
        session: Session = Depends(get_session),
    ):
        item = get_or_404(session, item_id)
        item.sqlmodel_update(data.model_dump())
        session.add(item)
        session.commit()
        session.refresh(item)
        return item

    @router.delete("/{item_id}", status_code=204)
    def delete_item(item_id: int, session: Session = Depends(get_session)):
        session.delete(get_or_404(session, item_id))
        session.commit()

    return router
